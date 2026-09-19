const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];

const text = {
  en: {
    toolLink: "Password tool",
    eyebrow: "Passwords / Explainer",
    title: "What is a hash?",
    intro: "A hash is a one-way fingerprint. The same password makes the same fingerprint when you use the same recipe, but the fingerprint is not the password.",
    formatTitle: "The saved text has four parts",
    formatText: "This page's generator stores the algorithm name, the number of repeats, the salt, and the final hash. Those parts are enough to test a password later, but not enough to read the original password.",
    stepOneTitle: "Turn text into bytes",
    stepOneText: "The password you type is changed into bytes, because hash functions work on bytes instead of letters on the screen.",
    stepTwoTitle: "Add a random salt",
    stepTwoText: "A salt is random extra data saved beside the hash. It makes two people with the same password get different stored hashes.",
    stepThreeTitle: "Repeat the work many times",
    stepThreeText: "PBKDF2 runs SHA-256 again and again. More iterations make guessing slower for attackers and still quick enough for real users.",
    stepFourTitle: "Save the recipe, not the password",
    stepFourText: "The site saves the recipe and result. To check a login, it repeats the same recipe with the typed password and compares the new result.",
    oneWayTitle: "Why is it one-way?",
    oneWayText: "SHA-256 mixes the input so strongly that a tiny change makes a totally different output. There is no undo button or hidden password inside the hash. The practical attack is guessing passwords and checking each guess, so salts and iterations make guessing much harder.",
    verifyTitle: "How verification works",
    verifyOne: "Read the algorithm, iterations, salt, and stored hash.",
    verifyTwo: "Run the typed password through the same recipe.",
    verifyThree: "Compare the new hash with the stored hash.",
    verifyFour: "If they match, the password was right.",
    tryTool: "Try the password hash tool",
    miscHome: "Back to Tools",
  },
  zh: {
    toolLink: "密码工具",
    eyebrow: "密码 / 说明",
    title: "什么是哈希？",
    intro: "哈希像一个单向指纹。同一个密码用同一个配方会得到同一个指纹，但这个指纹不是密码本身。",
    formatTitle: "保存的文本有四部分",
    formatText: "这个页面的生成器会保存算法名、重复次数、盐和最终哈希。这些内容足够以后测试密码，但不能读回原密码。",
    stepOneTitle: "把文字变成字节",
    stepOneText: "你输入的密码会先变成字节，因为哈希函数处理的是字节，不是屏幕上的字。",
    stepTwoTitle: "加入随机盐",
    stepTwoText: "盐是和哈希一起保存的随机数据。它让两个相同密码的人也得到不同的保存结果。",
    stepThreeTitle: "重复计算很多次",
    stepThreeText: "PBKDF2 会反复运行 SHA-256。更多迭代会让攻击者猜密码更慢，同时普通用户仍然能快速登录。",
    stepFourTitle: "保存配方，不保存密码",
    stepFourText: "网站保存的是配方和结果。检查登录时，它用输入的密码重新跑同样的配方，再比较新结果。",
    oneWayTitle: "为什么是单向的？",
    oneWayText: "SHA-256 会把输入强力混合，哪怕只改一点点，输出也会完全不同。哈希里没有撤销按钮，也没有藏着原密码。真正的攻击方式是不断猜密码再验证，所以盐和迭代会让猜测更难。",
    verifyTitle: "验证是怎么工作的",
    verifyOne: "读取算法、迭代次数、盐和已保存的哈希。",
    verifyTwo: "把输入的密码跑进同一个配方。",
    verifyThree: "比较新哈希和已保存的哈希。",
    verifyFour: "如果相同，密码就是正确的。",
    tryTool: "试试密码哈希工具",
    miscHome: "回到工具",
  },
  ja: {
    toolLink: "パスワードツール",
    eyebrow: "パスワード / 解説",
    title: "ハッシュとは？",
    intro: "ハッシュは一方向の指紋です。同じレシピなら同じパスワードは同じ指紋になりますが、その指紋はパスワードそのものではありません。",
    formatTitle: "保存される文字列は4つの部分",
    formatText: "このページの生成器は、アルゴリズム名、反復回数、ソルト、最終ハッシュを保存します。後で確認するには十分ですが、元のパスワードを読むには不十分です。",
    stepOneTitle: "文字をバイトに変える",
    stepOneText: "ハッシュ関数は画面の文字ではなくバイトを処理するため、入力したパスワードはまずバイトに変換されます。",
    stepTwoTitle: "ランダムなソルトを加える",
    stepTwoText: "ソルトはハッシュと一緒に保存するランダムなデータです。同じパスワードでも保存結果を別々にします。",
    stepThreeTitle: "何度も繰り返す",
    stepThreeText: "PBKDF2 は SHA-256 を何度も実行します。反復回数が多いほど推測攻撃は遅くなり、通常の利用には十分速いままです。",
    stepFourTitle: "パスワードではなくレシピを保存",
    stepFourText: "サイトはレシピと結果を保存します。ログイン確認では、入力されたパスワードで同じレシピを再実行し、新しい結果を比較します。",
    oneWayTitle: "なぜ一方向なの？",
    oneWayText: "SHA-256 は入力を強く混ぜるので、少し変えるだけで出力が大きく変わります。ハッシュには元に戻すボタンも隠れたパスワードもありません。現実的な攻撃は推測して確認することなので、ソルトと反復がそれを難しくします。",
    verifyTitle: "確認の流れ",
    verifyOne: "アルゴリズム、反復回数、ソルト、保存済みハッシュを読む。",
    verifyTwo: "入力されたパスワードを同じレシピに通す。",
    verifyThree: "新しいハッシュと保存済みハッシュを比べる。",
    verifyFour: "一致すれば、パスワードは正しいです。",
    tryTool: "パスワードハッシュツールを試す",
    miscHome: "ツールへ戻る",
  },
  ko: {
    toolLink: "비밀번호 도구",
    eyebrow: "비밀번호 / 설명",
    title: "해시란?",
    intro: "해시는 단방향 지문입니다. 같은 방법을 쓰면 같은 비밀번호는 같은 지문을 만들지만, 그 지문이 비밀번호 자체는 아닙니다.",
    formatTitle: "저장된 문자는 네 부분입니다",
    formatText: "이 페이지의 생성기는 알고리즘 이름, 반복 횟수, 솔트, 최종 해시를 저장합니다. 나중에 비밀번호를 확인하기에는 충분하지만 원래 비밀번호를 읽을 수는 없습니다.",
    stepOneTitle: "문자를 바이트로 바꾸기",
    stepOneText: "해시 함수는 화면의 글자가 아니라 바이트를 다루기 때문에, 입력한 비밀번호가 먼저 바이트로 바뀝니다.",
    stepTwoTitle: "무작위 솔트 추가",
    stepTwoText: "솔트는 해시 옆에 저장되는 무작위 데이터입니다. 같은 비밀번호를 써도 저장된 해시가 달라지게 합니다.",
    stepThreeTitle: "작업을 많이 반복",
    stepThreeText: "PBKDF2는 SHA-256을 계속 반복합니다. 반복이 많을수록 공격자의 추측은 느려지고, 실제 사용자는 여전히 빠르게 확인할 수 있습니다.",
    stepFourTitle: "비밀번호가 아니라 방법을 저장",
    stepFourText: "사이트는 방법과 결과를 저장합니다. 로그인 확인 때 입력한 비밀번호로 같은 방법을 다시 실행하고 새 결과를 비교합니다.",
    oneWayTitle: "왜 단방향인가요?",
    oneWayText: "SHA-256은 입력을 강하게 섞어서 아주 작은 변화도 완전히 다른 출력을 만듭니다. 해시 안에는 되돌리기 버튼도 숨겨진 비밀번호도 없습니다. 실제 공격은 비밀번호를 추측해 확인하는 것이므로, 솔트와 반복이 추측을 훨씬 어렵게 만듭니다.",
    verifyTitle: "검증 방식",
    verifyOne: "알고리즘, 반복 횟수, 솔트, 저장된 해시를 읽습니다.",
    verifyTwo: "입력한 비밀번호를 같은 방법으로 처리합니다.",
    verifyThree: "새 해시와 저장된 해시를 비교합니다.",
    verifyFour: "같으면 비밀번호가 맞습니다.",
    tryTool: "비밀번호 해시 도구 사용",
    miscHome: "도구로 돌아가기",
  },
  es: {
    toolLink: "Herramienta de contraseña",
    eyebrow: "Contraseñas / Explicación",
    title: "¿Qué es un hash?",
    intro: "Un hash es una huella de una sola dirección. La misma contraseña crea la misma huella con la misma receta, pero la huella no es la contraseña.",
    formatTitle: "El texto guardado tiene cuatro partes",
    formatText: "El generador guarda el algoritmo, las repeticiones, la sal y el hash final. Eso alcanza para probar una contraseña después, pero no para leer la contraseña original.",
    stepOneTitle: "Convertir texto en bytes",
    stepOneText: "La contraseña se convierte en bytes, porque las funciones hash trabajan con bytes y no con letras en la pantalla.",
    stepTwoTitle: "Agregar una sal aleatoria",
    stepTwoText: "Una sal es dato aleatorio guardado junto al hash. Hace que dos personas con la misma contraseña tengan hashes guardados distintos.",
    stepThreeTitle: "Repetir muchas veces",
    stepThreeText: "PBKDF2 ejecuta SHA-256 una y otra vez. Más iteraciones hacen más lenta la adivinación para atacantes y siguen siendo rápidas para usuarios reales.",
    stepFourTitle: "Guardar la receta, no la contraseña",
    stepFourText: "El sitio guarda la receta y el resultado. Para iniciar sesión, repite la receta con la contraseña escrita y compara el nuevo resultado.",
    oneWayTitle: "¿Por qué es de una sola dirección?",
    oneWayText: "SHA-256 mezcla tanto la entrada que un cambio pequeño crea una salida totalmente distinta. No hay botón de deshacer ni contraseña escondida dentro del hash. El ataque práctico es adivinar y probar, así que la sal y las iteraciones lo hacen mucho más difícil.",
    verifyTitle: "Cómo funciona la verificación",
    verifyOne: "Leer algoritmo, iteraciones, sal y hash guardado.",
    verifyTwo: "Pasar la contraseña escrita por la misma receta.",
    verifyThree: "Comparar el nuevo hash con el guardado.",
    verifyFour: "Si coinciden, la contraseña era correcta.",
    tryTool: "Probar la herramienta de hash",
    miscHome: "Volver a Tools",
  },
};

["fr", "de", "pt", "ru", "ar"].forEach((code) => {
  text[code] = { ...text.es };
});

function currentLanguage() {
  const saved = localStorage.getItem("muye-lang") || "en";
  return languages.includes(saved) ? saved : "en";
}

function t(key) {
  return text[currentLanguage()]?.[key] || text.en[key] || key;
}

function applyLanguage() {
  const code = currentLanguage();
  document.documentElement.lang = code;
  document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
}

document.querySelector("#language-button").addEventListener("click", () => {
  const index = languages.indexOf(currentLanguage());
  localStorage.setItem("muye-lang", languages[(index + 1) % languages.length]);
  applyLanguage();
});

applyLanguage();
