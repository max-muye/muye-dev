// Worker 2 v41
// Secrets: DATABASE_URL, CLERK_JWT_KEY, ADMIN_PASSWD

const ORIGIN="https://www.muye.dev";

const C={
  "Access-Control-Allow-Origin":ORIGIN,
  "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":"Authorization,Content-Type"
};

const J=(x,s=200)=>new Response(JSON.stringify(x),{
  status:s,
  headers:{
    "content-type":"application/json; charset=utf-8",
    ...C
  }
});

const ep=c=>"https://"+new URL(c).hostname+"/sql";

async function q(e,query,params=[]){
  let r=await fetch(ep(e.DATABASE_URL),{
    method:"POST",
    headers:{
      "content-type":"application/json",
      "Neon-Connection-String":e.DATABASE_URL
    },
    body:JSON.stringify({query,params})
  });

  let d=await r.json();

  if(!r.ok)
    throw Error(d.message||d.error||"Database error");

  return d.rows||[];
}

function b64(s){
  s=s.replace(/-/g,"+").replace(/_/g,"/");
  while(s.length%4)s+="=";

  return Uint8Array.from(
    atob(s),
    c=>c.charCodeAt(0)
  );
}

function pem(p){
  return Uint8Array.from(
    atob(
      p.replace(
        /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g,
        ""
      )
    ),
    c=>c.charCodeAt(0)
  );
}

async function clerkUser(r,e){
  let t=(r.headers.get("Authorization")||"")
    .replace(/^Bearer\s+/i,"");

  let [h,p,s]=t.split(".");

  if(!s)
    throw Error("Unauthorized");

  let H=JSON.parse(
    new TextDecoder().decode(b64(h))
  );

  let P=JSON.parse(
    new TextDecoder().decode(b64(p))
  );

  if(H.alg!=="RS256")
    throw Error("Unauthorized");

  let k=await crypto.subtle.importKey(
    "spki",
    pem(e.CLERK_JWT_KEY),
    {
      name:"RSASSA-PKCS1-v1_5",
      hash:"SHA-256"
    },
    false,
    ["verify"]
  );

  let ok=await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    k,
    b64(s),
    new TextEncoder().encode(h+"."+p)
  );

  if(
    !ok ||
    !P.sub ||
    P.exp<Date.now()/1000
  )
    throw Error("Unauthorized");

  return P.sub;
}

function enc(b){
  return btoa(
    String.fromCharCode(...b)
  )
    .replace(/\+/g,"-")
    .replace(/\//g,"_")
    .replace(/=+$/,"");
}

function dec(s){
  s=s.replace(/-/g,"+").replace(/_/g,"/");

  while(s.length%4)
    s+="=";

  return Uint8Array.from(
    atob(s),
    c=>c.charCodeAt(0)
  );
}

async function hkey(s){
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    {
      name:"HMAC",
      hash:"SHA-256"
    },
    false,
    ["sign","verify"]
  );
}

async function adminToken(secret){
  let p=enc(
    new TextEncoder().encode(
      JSON.stringify({
        role:"admin",
        exp:Date.now()+8*60*60*1000
      })
    )
  );

  let sig=enc(
    new Uint8Array(
      await crypto.subtle.sign(
        "HMAC",
        await hkey(secret),
        new TextEncoder().encode(p)
      )
    )
  );

  return p+"."+sig;
}

async function adminOK(secret,t){
  try{
    let [p,s]=t.split(".");

    if(!p||!s)
      return false;

    let ok=await crypto.subtle.verify(
      "HMAC",
      await hkey(secret),
      dec(s),
      new TextEncoder().encode(p)
    );

    if(!ok)
      return false;

    let d=JSON.parse(
      new TextDecoder().decode(dec(p))
    );

    return (
      d.role==="admin" &&
      d.exp>Date.now()
    );
  }catch{
    return false;
  }
}

function eq(a,b){
  a=String(a||"");
  b=String(b||"");

  if(a.length!==b.length)
    return false;

  let x=0;

  for(let i=0;i<a.length;i++)
    x|=a.charCodeAt(i)^b.charCodeAt(i);

  return x===0;
}

const slugOK=s=>
  typeof s==="string" &&
  /^[a-z0-9][a-z0-9-]{0,39}$/.test(s);

const nameOK=s=>
  typeof s==="string" &&
  [...s].length>0 &&
  [...s].length<=48 &&
  !/[\s()\/.?#\u0000-\u001F\u007F]/u.test(s);

async function setup(e){
  await q(
    e,
    `CREATE TABLE IF NOT EXISTS lambda_builtins(
      name TEXT PRIMARY KEY,
      expression TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );

  await q(
    e,
    `CREATE TABLE IF NOT EXISTS lambda_publish_names(
      user_id TEXT PRIMARY KEY,
      user_slug TEXT UNIQUE NOT NULL
    )`
  );

  await q(
    e,
    `CREATE TABLE IF NOT EXISTS lambda_published_v41(
      user_id TEXT NOT NULL,
      user_slug TEXT NOT NULL,
      project_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      expression TEXT NOT NULL,
      functions JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY(user_slug,project_slug)
    )`
  );
}

export async function onRequest(context){
  const r=context.request;
  const e=context.env;
  let u=new URL(r.url);
  u.pathname=u.pathname.replace(/^\/misc\/lambda\/api/, "/api");

    if(r.method==="OPTIONS")
      return new Response(null,{
        status:204,
        headers:C
      });

    if(
      r.method==="GET" &&
      u.pathname==="/"
    ){
      return J({
        ok:true,
        service:"lambda-api",
        version:41,
        databaseConfigured:!!e.DATABASE_URL,
        clerkConfigured:!!e.CLERK_JWT_KEY,
        adminConfigured:!!e.ADMIN_PASSWD
      });
    }

    if(!e.DATABASE_URL)
      return J(
        {error:"DATABASE_URL missing"},
        503
      );

    try{
      await setup(e);

      // All published projects
      if(
        r.method==="GET" &&
        u.pathname==="/api/published"
      ){
        let rows=await q(
          e,
          `SELECT
            user_slug,
            project_slug,
            name,
            updated_at
           FROM lambda_published_v41
           ORDER BY updated_at DESC
           LIMIT 500`
        );

        return J({
          projects:rows
        });
      }

      // Public published project
      let pm=u.pathname.match(
        /^\/api\/published\/([a-z0-9-]+)\/([a-z0-9-]+)$/
      );

      if(
        r.method==="GET" &&
        pm
      ){
        let rows=await q(
          e,
          `SELECT
            user_slug,
            project_slug,
            name,
            expression,
            functions,
            created_at,
            updated_at
           FROM lambda_published_v41
           WHERE
             user_slug=$1
             AND project_slug=$2`,
          [
            pm[1],
            pm[2]
          ]
        );

        return rows.length
          ? J(rows[0])
          : J(
              {
                error:
                  "Published project not found"
              },
              404
            );
      }

      // Publish
      if(
        r.method==="POST" &&
        u.pathname==="/api/publish"
      ){
        let id;

        try{
          id=await clerkUser(r,e);
        }catch{
          return J(
            {error:"Unauthorized"},
            401
          );
        }

        let b={};

        try{
          b=await r.json();
        }catch{}

        b.userSlug=
          String(b.userSlug||"")
            .toLowerCase();

        b.projectSlug=
          String(b.projectSlug||"")
            .toLowerCase();

        if(
          !slugOK(b.userSlug) ||
          !slugOK(b.projectSlug) ||
          typeof b.name!=="string" ||
          typeof b.expression!=="string" ||
          !b.functions ||
          typeof b.functions!=="object"
        ){
          return J(
            {
              error:
                "Invalid publish data"
            },
            400
          );
        }

        let owned=await q(
          e,
          `SELECT user_slug
           FROM lambda_publish_names
           WHERE user_id=$1`,
          [id]
        );

        if(
          owned.length &&
          owned[0].user_slug!==b.userSlug
        ){
          return J(
            {
              error:
                "This account already uses public user ID "+
                owned[0].user_slug
            },
            409
          );
        }

        let taken=await q(
          e,
          `SELECT user_id
           FROM lambda_publish_names
           WHERE user_slug=$1`,
          [b.userSlug]
        );

        if(
          taken.length &&
          taken[0].user_id!==id
        ){
          return J(
            {
              error:
                "Public user ID is already taken"
            },
            409
          );
        }

        await q(
          e,
          `INSERT INTO lambda_publish_names(
             user_id,
             user_slug
           )
           VALUES($1,$2)
           ON CONFLICT(user_id)
           DO UPDATE SET
             user_slug=EXCLUDED.user_slug`,
          [
            id,
            b.userSlug
          ]
        );

        let conflict=await q(
          e,
          `SELECT user_id
           FROM lambda_published_v41
           WHERE
             user_slug=$1
             AND project_slug=$2`,
          [
            b.userSlug,
            b.projectSlug
          ]
        );

        if(
          conflict.length &&
          conflict[0].user_id!==id
        ){
          return J(
            {
              error:
                "That public project ID is already taken"
            },
            409
          );
        }

        await q(
          e,
          `INSERT INTO lambda_published_v41(
             user_id,
             user_slug,
             project_slug,
             name,
             expression,
             functions,
             updated_at
           )
           VALUES(
             $1,$2,$3,$4,$5,$6::jsonb,NOW()
           )
           ON CONFLICT(user_slug,project_slug)
           DO UPDATE SET
             name=EXCLUDED.name,
             expression=EXCLUDED.expression,
             functions=EXCLUDED.functions,
             updated_at=NOW()`,
          [
            id,
            b.userSlug,
            b.projectSlug,
            b.name,
            b.expression,
            JSON.stringify(
              b.functions
            )
          ]
        );

        return J({
          ok:true,
          userSlug:b.userSlug,
          projectSlug:b.projectSlug
        });
      }

      // Public built-ins
      if(
        r.method==="GET" &&
        u.pathname==="/api/builtins"
      ){
        let rows=await q(
          e,
          `SELECT
             name,
             expression
           FROM lambda_builtins
           ORDER BY name`
        );

        return J({
          builtins:
            Object.fromEntries(
              rows.map(
                x=>[
                  x.name,
                  x.expression
                ]
              )
            )
        });
      }

      // Admin login
      if(
        r.method==="POST" &&
        u.pathname==="/api/admin/login"
      ){
        if(!e.ADMIN_PASSWD)
          return J(
            {
              error:
                "ADMIN_PASSWD is not configured"
            },
            503
          );

        let b={};

        try{
          b=await r.json();
        }catch{}

        if(
          !eq(
            b.password,
            e.ADMIN_PASSWD
          )
        ){
          return J(
            {
              error:
                "Wrong admin password"
            },
            401
          );
        }

        return J({
          ok:true,
          token:
            await adminToken(
              e.ADMIN_PASSWD
            )
        });
      }

      // Admin API
      if(
        u.pathname.startsWith(
          "/api/admin/"
        )
      ){
        if(!e.ADMIN_PASSWD)
          return J(
            {
              error:
                "ADMIN_PASSWD is not configured"
            },
            503
          );

        let t=
          (
            r.headers.get(
              "Authorization"
            )||""
          )
          .replace(
            /^Bearer\s+/i,
            ""
          );

        if(
          !await adminOK(
            e.ADMIN_PASSWD,
            t
          )
        ){
          return J(
            {
              error:
                "Admin session expired or invalid"
            },
            401
          );
        }

        if(
          r.method==="GET" &&
          u.pathname===
            "/api/admin/builtins"
        ){
          return J({
            builtins:
              await q(
                e,
                `SELECT
                   name,
                   expression,
                   updated_at
                 FROM lambda_builtins
                 ORDER BY name`
              )
          });
        }

        let m=u.pathname.match(
          /^\/api\/admin\/builtins\/([^/]+)$/
        );

        if(!m)
          return J(
            {error:"Not found"},
            404
          );

        let n;

        try{
          n=
            decodeURIComponent(
              m[1]
            )
            .toLowerCase();
        }catch{
          return J(
            {
              error:
                "Invalid name"
            },
            400
          );
        }

        if(!nameOK(n))
          return J(
            {
              error:
                "Invalid built-in name"
            },
            400
          );

        if(
          r.method==="PUT"
        ){
          let b={};

          try{
            b=await r.json();
          }catch{}

          if(
            typeof b.expression!==
              "string" ||
            !b.expression.trim()
          ){
            return J(
              {
                error:
                  "Invalid expression"
              },
              400
            );
          }

          await q(
            e,
            `INSERT INTO lambda_builtins(
               name,
               expression,
               updated_at
             )
             VALUES(
               $1,$2,NOW()
             )
             ON CONFLICT(name)
             DO UPDATE SET
               expression=
                 EXCLUDED.expression,
               updated_at=
                 NOW()`,
            [
              n,
              b.expression
            ]
          );

          return J({
            ok:true,
            name:n
          });
        }

        if(
          r.method==="DELETE"
        ){
          await q(
            e,
            `DELETE FROM lambda_builtins
             WHERE name=$1`,
            [n]
          );

          return J({
            ok:true,
            name:n
          });
        }

        return J(
          {
            error:
              "Method not allowed"
          },
          405
        );
      }

      return J(
        {error:"Not found"},
        404
      );

    }catch(x){
      return J(
        {
          error:
            x.message||
            "Server error"
        },
        500
      );
    }
}
