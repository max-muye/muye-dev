let muyeCaptchaToken = window.muyeCaptchaToken || "";
window.muyeCaptchaCallback = (token) => { muyeCaptchaToken = token; window.muyeCaptchaToken = token; };
window.muyeCaptchaExpired = () => { muyeCaptchaToken = ""; window.muyeCaptchaToken = ""; };
const login = document.querySelector("#mailbox-login");
const app = document.querySelector("#mailbox-app");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const resetPanel = document.querySelector("#reset-panel");
const resetForm = document.querySelector("#reset-form");
const resetMessage = document.querySelector("#reset-message");
const changePasswordPanel = document.querySelector("#change-password-panel");
const changePasswordForm = document.querySelector("#change-password-form");
const changePasswordMessage = document.querySelector("#change-password-message");
const deleteMailboxPanel = document.querySelector("#delete-mailbox-panel");
const deleteMailboxForm = document.querySelector("#delete-mailbox-form");
const deleteMailboxMessage = document.querySelector("#delete-mailbox-message");
const composeForm = document.querySelector("#compose-form");
const composeMessage = document.querySelector("#compose-message");
const composeAttachments = document.querySelector("#compose-attachments");
const inboxMessage = document.querySelector("#inbox-message");
const messageList = document.querySelector("#message-list");
const messageDetail = document.querySelector("#message-detail");
const address = document.querySelector("#mailbox-address");
const mailboxTitle = document.querySelector("#mailbox-title");
const viewButtons = document.querySelectorAll("[data-view]");
const admin = document.querySelector("#mailbox-admin");
const adminSummary = document.querySelector("#admin-summary");
const adminMailboxList = document.querySelector("#admin-mailbox-list");
const adminRequestList = document.querySelector("#admin-request-list");
const adminMessageList = document.querySelector("#admin-message-list");
const adminMessageDetail = document.querySelector("#admin-message-detail");
const adminMessage = document.querySelector("#admin-message");
const todayKey = new Date().toISOString().slice(0, 10);
let selectedAttachments = [];
let currentView = "inbox";
let adminToken = "";
let selectedAdminMailbox = "";
let newestInboxId = 0;
let hasLoadedInboxOnce = false;
let notificationTimer = null;
let messagesLoading = false;
let pendingView = null;
let composeSending = false;

const mailboxText = {
  en: {
    home: "Home", eyebrow: "Muye mail", loginTitle: "Your mailbox", loginCopy: "Sign in with the Muye email and password you created.", email: "Email", password: "Password", show: "Show", hide: "Hide", openToday: "Open mail for today", openMailbox: "Open mailbox", replacePassword: "Replace password", changePassword: "Change password", cancel: "Cancel", passwordChanged: "Password changed.", changePasswordFailed: "Could not change password.", needEmail: "Need a Muye email?", createOne: "Create one", recovery: "Account recovery", resetCopy: "Enter the email used when you created your mailbox.", verificationEmail: "Verification email", verificationCode: "Verification code", codePlaceholder: "6-character code", sendCode: "Send verification code", newPassword: "New password", confirmPassword: "Confirm new password", backLogin: "Back to mailbox sign in", signOut: "Sign out", inbox: "Inbox", outbox: "Outbox", trash: "Trash", messages: "Messages", refresh: "Refresh", preview: "Preview", close: "Close", clickPreview: "Click a message to preview it.", newMessage: "New message", to: "To", from: "From", subject: "Subject", message: "Message", file: "File", removeFile: "Remove file", sendMessage: "Send message", admin: "Admin", allMailboxes: "All mailboxes", mailboxes: "Mailboxes", requests: "Requests", chooseMailbox: "Choose a mailbox or message.", emptyInbox: "Your inbox is empty.", emptyOutbox: "Your outbox is empty.", emptyTrash: "Trash is empty.", markRead: "Mark read", markUnread: "Mark unread", restore: "Restore", moveTrash: "Move to trash", download: "Download", active: "Active", banned: "Banned", request: "Email request", noRequester: "No signed-in requester", approveRequest: "Approve request", temporaryPassword: "Temporary password", approving: "Approving...", approved: "Request approved", mailboxControls: "Mailbox controls", bannedMailbox: "Banned mailbox", banMailbox: "Ban mailbox", unbanMailbox: "Unban mailbox", deleteMailbox: "Delete mailbox", deleteMessage: "Delete message", noMailboxes: "No mailboxes yet.", noRequests: "No requests yet.", chooseMailboxInspect: "Choose a mailbox to inspect messages.", noMailboxMessages: "No messages in this mailbox.", messageDeleted: "Message deleted.", mailboxDeleted: "Mailbox deleted.", loading: "Loading...", opening: "Opening mailbox...", signInPrompt: "Sign in to your mailbox.", refreshFailed: "Could not refresh mailbox.", refreshFailedLong: "Could not refresh mailbox. Check the connection and try again.", adminFailed: "Admin request failed.", adminRequired: "Admin access required.", loadMailboxFailed: "Could not load mailbox.", updateMailboxFailed: "Could not update mailbox.", deleteMessageFailed: "Could not delete message.", deleteMailboxFailed: "Could not delete mailbox.", deleteMessageAsk: "Delete this message permanently?", deleteMailboxAsk: "Delete this mailbox and all of its messages permanently?", waitCaptcha: "Please wait for the CAPTCHA, then try again.", openFailed: "Could not open mailbox.", enterEmail: "Enter your verification email.", codeSendFailed: "Could not send code.", codeSent: "Verification code sent by email.", codeSentNext: "Code sent. Enter it above, then press Replace password.", enterCode: "Enter the verification code you received.", passwordMismatch: "Passwords do not match.", passwordShort: "Password must be at least 8 characters and include a number.", codeInvalid: "That code is not valid.", replaceFailed: "Could not replace password.", replaced: "Password replaced. You can sign in now.", fileTooLarge: "Choose a file under 4 MB.", fileLoadFailed: "Could not load file.", sending: "Sending...", sendFailed: "Could not send message.", sent: "Message sent.", newMailFrom: "New mail from",
  },
  zh: {
    home: "主页", eyebrow: "Muye 邮箱", loginTitle: "你的邮箱", loginCopy: "使用你创建的 Muye 邮箱和密码登录。", email: "邮箱", password: "密码", show: "显示", hide: "隐藏", openToday: "今天保持打开", openMailbox: "打开邮箱", replacePassword: "更换密码", needEmail: "需要 Muye 邮箱？", createOne: "创建一个", recovery: "账户恢复", resetCopy: "输入你创建邮箱时使用的邮箱。", verificationEmail: "验证邮箱", verificationCode: "验证码", codePlaceholder: "6 位验证码", sendCode: "发送验证码", newPassword: "新密码", confirmPassword: "确认新密码", backLogin: "返回邮箱登录", signOut: "退出", inbox: "收件箱", outbox: "发件箱", trash: "垃圾箱", messages: "邮件", refresh: "刷新", preview: "预览", close: "关闭", clickPreview: "点一封邮件来预览。", newMessage: "新邮件", to: "收件人", from: "发件人", subject: "主题", message: "内容", file: "文件", removeFile: "移除文件", sendMessage: "发送邮件", admin: "管理", allMailboxes: "所有邮箱", mailboxes: "邮箱", requests: "请求", chooseMailbox: "选择邮箱或邮件。", emptyInbox: "收件箱是空的。", emptyOutbox: "发件箱是空的。", emptyTrash: "垃圾箱是空的。", markRead: "标为已读", markUnread: "标为未读", restore: "恢复", moveTrash: "移到垃圾箱", download: "下载", active: "正常", banned: "已封禁", request: "邮箱请求", noRequester: "没有登录的请求者", approveRequest: "批准请求", temporaryPassword: "临时密码", approving: "批准中...", approved: "请求已批准", mailboxControls: "邮箱控制", bannedMailbox: "已封禁邮箱", banMailbox: "封禁邮箱", unbanMailbox: "解封邮箱", deleteMailbox: "删除邮箱", deleteMessage: "删除邮件", noMailboxes: "还没有邮箱。", noRequests: "还没有请求。", chooseMailboxInspect: "选择一个邮箱查看邮件。", noMailboxMessages: "这个邮箱没有邮件。", messageDeleted: "邮件已删除。", mailboxDeleted: "邮箱已删除。", loading: "加载中...", opening: "正在打开邮箱...", signInPrompt: "请登录你的邮箱。", refreshFailed: "无法刷新邮箱。", refreshFailedLong: "无法刷新邮箱，请检查连接后重试。", adminFailed: "管理请求失败。", adminRequired: "需要管理员权限。", loadMailboxFailed: "无法加载邮箱。", updateMailboxFailed: "无法更新邮箱。", deleteMessageFailed: "无法删除邮件。", deleteMailboxFailed: "无法删除邮箱。", deleteMessageAsk: "永久删除这封邮件？", deleteMailboxAsk: "删除这个邮箱和它所有的邮件？", waitCaptcha: "请等待验证码完成后再试。", openFailed: "无法打开邮箱。", enterEmail: "请输入验证邮箱。", codeSendFailed: "无法发送验证码。", codeSent: "验证码已通过邮件发送。", codeSentNext: "验证码已发送。填入上方后按更换密码。", enterCode: "请输入收到的验证码。", passwordMismatch: "两次密码不一致。", passwordShort: "密码至少需要 8 个字符。", codeInvalid: "验证码无效。", replaceFailed: "无法更换密码。", replaced: "密码已更换，现在可以登录。", fileTooLarge: "请选择小于 4 MB 的文件。", fileLoadFailed: "无法读取文件。", sending: "发送中...", sendFailed: "无法发送邮件。", sent: "邮件已发送。", newMailFrom: "新邮件来自",
  },
};

mailboxText.ja = { ...mailboxText.en, home: "ホーム", loginTitle: "メールボックス", loginCopy: "作成した Muye メールとパスワードでログイン。", email: "メール", password: "パスワード", show: "表示", hide: "隠す", openMailbox: "開く", replacePassword: "パスワード変更", signOut: "ログアウト", inbox: "受信箱", outbox: "送信箱", trash: "ゴミ箱", messages: "メッセージ", refresh: "更新", preview: "プレビュー", close: "閉じる", newMessage: "新規メッセージ", to: "宛先", from: "差出人", subject: "件名", message: "本文", file: "ファイル", sendMessage: "送信", sent: "送信しました。", sending: "送信中...", emptyInbox: "受信箱は空です。", emptyOutbox: "送信箱は空です。", emptyTrash: "ゴミ箱は空です。" };
mailboxText.ko = { ...mailboxText.en, home: "홈", loginTitle: "메일함", loginCopy: "만든 Muye 메일과 비밀번호로 로그인하세요.", email: "이메일", password: "비밀번호", show: "보기", hide: "숨기기", openMailbox: "메일함 열기", replacePassword: "비밀번호 변경", signOut: "로그아웃", inbox: "받은메일", outbox: "보낸메일", trash: "휴지통", messages: "메시지", refresh: "새로고침", preview: "미리보기", close: "닫기", newMessage: "새 메시지", to: "받는 사람", from: "보낸 사람", subject: "제목", message: "내용", file: "파일", sendMessage: "보내기", sent: "메시지를 보냈습니다.", sending: "보내는 중...", emptyInbox: "받은메일이 비어 있습니다.", emptyOutbox: "보낸메일이 비어 있습니다.", emptyTrash: "휴지통이 비어 있습니다." };
mailboxText.es = { ...mailboxText.en, home: "Inicio", loginTitle: "Tu buzón", loginCopy: "Entra con el email Muye y la contraseña que creaste.", email: "Email", password: "Contraseña", show: "Mostrar", hide: "Ocultar", openMailbox: "Abrir buzón", replacePassword: "Cambiar contraseña", signOut: "Salir", inbox: "Entrada", outbox: "Enviados", trash: "Papelera", messages: "Mensajes", refresh: "Actualizar", preview: "Vista previa", close: "Cerrar", newMessage: "Nuevo mensaje", to: "Para", from: "De", subject: "Asunto", message: "Mensaje", file: "Archivo", sendMessage: "Enviar", sent: "Mensaje enviado.", sending: "Enviando...", emptyInbox: "Tu entrada está vacía.", emptyOutbox: "Tus enviados están vacíos.", emptyTrash: "La papelera está vacía." };
mailboxText.fr = { ...mailboxText.en, home: "Accueil", loginTitle: "Votre boîte mail", loginCopy: "Connectez-vous avec votre email Muye et votre mot de passe.", email: "Email", password: "Mot de passe", show: "Afficher", hide: "Masquer", openMailbox: "Ouvrir", replacePassword: "Changer le mot de passe", signOut: "Déconnexion", inbox: "Reçus", outbox: "Envoyés", trash: "Corbeille", messages: "Messages", refresh: "Actualiser", preview: "Aperçu", close: "Fermer", newMessage: "Nouveau message", to: "À", from: "De", subject: "Sujet", message: "Message", file: "Fichier", sendMessage: "Envoyer", sent: "Message envoyé.", sending: "Envoi...", emptyInbox: "Votre boîte de réception est vide.", emptyOutbox: "Vos envoyés sont vides.", emptyTrash: "La corbeille est vide." };
mailboxText.de = { ...mailboxText.en, home: "Start", loginTitle: "Dein Postfach", loginCopy: "Mit deiner Muye-E-Mail und deinem Passwort anmelden.", email: "E-Mail", password: "Passwort", show: "Zeigen", hide: "Verbergen", openMailbox: "Postfach öffnen", replacePassword: "Passwort ändern", signOut: "Abmelden", inbox: "Eingang", outbox: "Gesendet", trash: "Papierkorb", messages: "Nachrichten", refresh: "Aktualisieren", preview: "Vorschau", close: "Schließen", newMessage: "Neue Nachricht", to: "An", from: "Von", subject: "Betreff", message: "Nachricht", file: "Datei", sendMessage: "Senden", sent: "Nachricht gesendet.", sending: "Senden...", emptyInbox: "Der Eingang ist leer.", emptyOutbox: "Gesendet ist leer.", emptyTrash: "Der Papierkorb ist leer." };
mailboxText.pt = { ...mailboxText.en, home: "Início", loginTitle: "Sua caixa de email", loginCopy: "Entre com o email Muye e a senha que você criou.", email: "Email", password: "Senha", show: "Mostrar", hide: "Ocultar", openMailbox: "Abrir email", replacePassword: "Trocar senha", signOut: "Sair", inbox: "Entrada", outbox: "Enviados", trash: "Lixeira", messages: "Mensagens", refresh: "Atualizar", preview: "Prévia", close: "Fechar", newMessage: "Nova mensagem", to: "Para", from: "De", subject: "Assunto", message: "Mensagem", file: "Arquivo", sendMessage: "Enviar", sent: "Mensagem enviada.", sending: "Enviando...", emptyInbox: "A entrada está vazia.", emptyOutbox: "Os enviados estão vazios.", emptyTrash: "A lixeira está vazia." };
mailboxText.ru = { ...mailboxText.en, home: "Домой", loginTitle: "Ваш почтовый ящик", loginCopy: "Войдите с Muye-почтой и паролем.", email: "Почта", password: "Пароль", show: "Показать", hide: "Скрыть", openMailbox: "Открыть почту", replacePassword: "Сменить пароль", signOut: "Выйти", inbox: "Входящие", outbox: "Отправленные", trash: "Корзина", messages: "Сообщения", refresh: "Обновить", preview: "Просмотр", close: "Закрыть", newMessage: "Новое письмо", to: "Кому", from: "От", subject: "Тема", message: "Сообщение", file: "Файл", sendMessage: "Отправить", sent: "Сообщение отправлено.", sending: "Отправка...", emptyInbox: "Входящих нет.", emptyOutbox: "Отправленных нет.", emptyTrash: "Корзина пуста." };
mailboxText.ar = { ...mailboxText.en, home: "الرئيسية", loginTitle: "صندوق بريدك", loginCopy: "سجّل الدخول ببريد Muye وكلمة المرور.", email: "البريد", password: "كلمة المرور", show: "إظهار", hide: "إخفاء", openMailbox: "فتح البريد", replacePassword: "تغيير كلمة المرور", signOut: "خروج", inbox: "الوارد", outbox: "المرسل", trash: "المهملات", messages: "الرسائل", refresh: "تحديث", preview: "معاينة", close: "إغلاق", newMessage: "رسالة جديدة", to: "إلى", from: "من", subject: "الموضوع", message: "الرسالة", file: "ملف", sendMessage: "إرسال", sent: "تم إرسال الرسالة.", sending: "جار الإرسال...", emptyInbox: "الوارد فارغ.", emptyOutbox: "المرسل فارغ.", emptyTrash: "المهملات فارغة." };

Object.assign(mailboxText.en, { file: "Files", removeFile: "Remove file", quote: "Quote", quotedHeader: "On {date}, {sender} wrote:", fileLimit: "Choose up to 5 files, 4 MB total.", tooManyFiles: "Choose no more than 5 files.", filesTooLarge: "Files must be 4 MB or less in total." });
Object.assign(mailboxText.zh, { file: "文件", removeFile: "移除文件", quote: "引用", quotedHeader: "{sender} 于 {date} 写道：", fileLimit: "最多选择 5 个文件，总计不超过 4 MB。", tooManyFiles: "最多只能选择 5 个文件。", filesTooLarge: "所有文件总计不能超过 4 MB。" });
Object.assign(mailboxText.ja, { file: "ファイル", removeFile: "ファイルを削除", quote: "引用", quotedHeader: "{date}、{sender} のメッセージ：", fileLimit: "最大5個、合計4 MBまで。", tooManyFiles: "ファイルは5個までです。", filesTooLarge: "ファイルの合計は4 MB以下にしてください。" });
Object.assign(mailboxText.ko, { file: "파일", removeFile: "파일 제거", quote: "인용", quotedHeader: "{date}, {sender} 작성:", fileLimit: "최대 5개, 총 4 MB까지 선택하세요.", tooManyFiles: "파일은 최대 5개까지 선택할 수 있습니다.", filesTooLarge: "파일 합계는 4 MB 이하여야 합니다." });
Object.assign(mailboxText.es, { file: "Archivos", removeFile: "Quitar archivo", quote: "Citar", quotedHeader: "El {date}, {sender} escribió:", fileLimit: "Elige hasta 5 archivos, 4 MB en total.", tooManyFiles: "Elige como máximo 5 archivos.", filesTooLarge: "Los archivos deben sumar 4 MB o menos." });
Object.assign(mailboxText.fr, { file: "Fichiers", removeFile: "Retirer le fichier", quote: "Citer", quotedHeader: "Le {date}, {sender} a écrit :", fileLimit: "Choisissez jusqu’à 5 fichiers, 4 Mo au total.", tooManyFiles: "Choisissez au maximum 5 fichiers.", filesTooLarge: "Les fichiers doivent totaliser 4 Mo ou moins." });
Object.assign(mailboxText.de, { file: "Dateien", removeFile: "Datei entfernen", quote: "Zitieren", quotedHeader: "Am {date} schrieb {sender}:", fileLimit: "Bis zu 5 Dateien, insgesamt 4 MB.", tooManyFiles: "Wähle höchstens 5 Dateien.", filesTooLarge: "Die Dateien dürfen zusammen höchstens 4 MB groß sein." });
Object.assign(mailboxText.pt, { file: "Arquivos", removeFile: "Remover arquivo", quote: "Citar", quotedHeader: "Em {date}, {sender} escreveu:", fileLimit: "Escolha até 5 arquivos, 4 MB no total.", tooManyFiles: "Escolha no máximo 5 arquivos.", filesTooLarge: "Os arquivos devem somar no máximo 4 MB." });
Object.assign(mailboxText.ru, { file: "Файлы", removeFile: "Удалить файл", quote: "Цитировать", quotedHeader: "{date}, {sender} написал(а):", fileLimit: "До 5 файлов, всего не более 4 МБ.", tooManyFiles: "Выберите не более 5 файлов.", filesTooLarge: "Общий размер файлов не должен превышать 4 МБ." });
Object.assign(mailboxText.ar, { file: "الملفات", removeFile: "إزالة الملف", quote: "اقتباس", quotedHeader: "في {date}، كتب {sender}:", fileLimit: "اختر حتى 5 ملفات، بإجمالي 4 ميجابايت.", tooManyFiles: "اختر 5 ملفات كحد أقصى.", filesTooLarge: "يجب ألا يتجاوز مجموع الملفات 4 ميجابايت." });

Object.assign(mailboxText.en, { quotedAttachments: "Attachments" });
Object.assign(mailboxText.zh, { quotedAttachments: "附件" });
Object.assign(mailboxText.ja, { quotedAttachments: "添付ファイル" });
Object.assign(mailboxText.ko, { quotedAttachments: "첨부 파일" });
Object.assign(mailboxText.es, { quotedAttachments: "Archivos adjuntos" });
Object.assign(mailboxText.fr, { quotedAttachments: "Pièces jointes" });
Object.assign(mailboxText.de, { quotedAttachments: "Anhänge" });
Object.assign(mailboxText.pt, { quotedAttachments: "Anexos" });
Object.assign(mailboxText.ru, { quotedAttachments: "Вложения" });
Object.assign(mailboxText.ar, { quotedAttachments: "المرفقات" });

Object.assign(mailboxText.en, { deleteOwnMailbox: "Delete email", deleteMailboxTitle: "Delete email", deleteMailboxWarning: "This permanently deletes your Muye email and every message stored in it. This cannot be undone.", currentPassword: "Current password", confirmMailbox: "Type your full Muye email", confirmMailboxHelp: "Enter the email shown above to confirm.", deletePermanently: "Delete permanently", deletingMailbox: "Deleting email...", confirmMailboxMismatch: "Type your full Muye email address exactly as shown above.", mailboxDeleteFailed: "Could not delete your email." });
Object.assign(mailboxText.zh, { deleteOwnMailbox: "删除邮箱", deleteMailboxTitle: "删除邮箱", deleteMailboxWarning: "这会永久删除你的 Muye 邮箱和其中保存的所有邮件，且无法撤销。", currentPassword: "当前密码", confirmMailbox: "输入完整的 Muye 邮箱", confirmMailboxHelp: "输入上方显示的邮箱以确认。", deletePermanently: "永久删除", deletingMailbox: "正在删除邮箱……", confirmMailboxMismatch: "请完全按照上方显示的内容输入完整的 Muye 邮箱。", mailboxDeleteFailed: "无法删除你的邮箱。" });
Object.assign(mailboxText.ja, { deleteOwnMailbox: "メールを削除", deleteMailboxTitle: "メールを削除", deleteMailboxWarning: "Muye メールと保存されたすべてのメッセージを完全に削除します。元に戻せません。", currentPassword: "現在のパスワード", confirmMailbox: "Muye メールをすべて入力", confirmMailboxHelp: "確認のため、上に表示されたメールを入力してください。", deletePermanently: "完全に削除", deletingMailbox: "メールを削除中...", confirmMailboxMismatch: "上に表示された Muye メールを正確に入力してください。", mailboxDeleteFailed: "メールを削除できませんでした。" });
Object.assign(mailboxText.ko, { deleteOwnMailbox: "이메일 삭제", deleteMailboxTitle: "이메일 삭제", deleteMailboxWarning: "Muye 이메일과 저장된 모든 메시지를 영구 삭제합니다. 되돌릴 수 없습니다.", currentPassword: "현재 비밀번호", confirmMailbox: "전체 Muye 이메일 입력", confirmMailboxHelp: "확인하려면 위에 표시된 이메일을 입력하세요.", deletePermanently: "영구 삭제", deletingMailbox: "이메일 삭제 중...", confirmMailboxMismatch: "위에 표시된 전체 Muye 이메일을 정확히 입력하세요.", mailboxDeleteFailed: "이메일을 삭제할 수 없습니다." });
Object.assign(mailboxText.es, { deleteOwnMailbox: "Eliminar email", deleteMailboxTitle: "Eliminar email", deleteMailboxWarning: "Esto elimina permanentemente tu email Muye y todos sus mensajes guardados. No se puede deshacer.", currentPassword: "Contraseña actual", confirmMailbox: "Escribe tu email Muye completo", confirmMailboxHelp: "Escribe el email mostrado arriba para confirmar.", deletePermanently: "Eliminar permanentemente", deletingMailbox: "Eliminando email...", confirmMailboxMismatch: "Escribe exactamente el email Muye completo mostrado arriba.", mailboxDeleteFailed: "No se pudo eliminar tu email." });
Object.assign(mailboxText.fr, { deleteOwnMailbox: "Supprimer l’email", deleteMailboxTitle: "Supprimer l’email", deleteMailboxWarning: "Cela supprime définitivement votre email Muye et tous ses messages enregistrés. Cette action est irréversible.", currentPassword: "Mot de passe actuel", confirmMailbox: "Saisissez votre email Muye complet", confirmMailboxHelp: "Saisissez l’email affiché ci-dessus pour confirmer.", deletePermanently: "Supprimer définitivement", deletingMailbox: "Suppression de l’email...", confirmMailboxMismatch: "Saisissez exactement l’email Muye complet affiché ci-dessus.", mailboxDeleteFailed: "Impossible de supprimer votre email." });
Object.assign(mailboxText.de, { deleteOwnMailbox: "E-Mail löschen", deleteMailboxTitle: "E-Mail löschen", deleteMailboxWarning: "Dadurch werden deine Muye-E-Mail und alle darin gespeicherten Nachrichten dauerhaft gelöscht. Dies kann nicht rückgängig gemacht werden.", currentPassword: "Aktuelles Passwort", confirmMailbox: "Vollständige Muye-E-Mail eingeben", confirmMailboxHelp: "Gib zur Bestätigung die oben angezeigte E-Mail ein.", deletePermanently: "Dauerhaft löschen", deletingMailbox: "E-Mail wird gelöscht...", confirmMailboxMismatch: "Gib die oben angezeigte vollständige Muye-E-Mail genau ein.", mailboxDeleteFailed: "Deine E-Mail konnte nicht gelöscht werden." });
Object.assign(mailboxText.pt, { deleteOwnMailbox: "Excluir email", deleteMailboxTitle: "Excluir email", deleteMailboxWarning: "Isso exclui permanentemente seu email Muye e todas as mensagens salvas nele. Não pode ser desfeito.", currentPassword: "Senha atual", confirmMailbox: "Digite seu email Muye completo", confirmMailboxHelp: "Digite o email mostrado acima para confirmar.", deletePermanently: "Excluir permanentemente", deletingMailbox: "Excluindo email...", confirmMailboxMismatch: "Digite exatamente o email Muye completo mostrado acima.", mailboxDeleteFailed: "Não foi possível excluir seu email." });
Object.assign(mailboxText.ru, { deleteOwnMailbox: "Удалить почту", deleteMailboxTitle: "Удалить почту", deleteMailboxWarning: "Это навсегда удалит вашу почту Muye и все сохранённые в ней сообщения. Отменить действие нельзя.", currentPassword: "Текущий пароль", confirmMailbox: "Введите полный адрес Muye", confirmMailboxHelp: "Для подтверждения введите адрес, показанный выше.", deletePermanently: "Удалить навсегда", deletingMailbox: "Удаление почты...", confirmMailboxMismatch: "Точно введите полный адрес Muye, показанный выше.", mailboxDeleteFailed: "Не удалось удалить вашу почту." });
Object.assign(mailboxText.ar, { deleteOwnMailbox: "حذف البريد", deleteMailboxTitle: "حذف البريد", deleteMailboxWarning: "سيؤدي هذا إلى حذف بريد Muye وجميع الرسائل المحفوظة فيه نهائيًا. لا يمكن التراجع عن ذلك.", currentPassword: "كلمة المرور الحالية", confirmMailbox: "اكتب بريد Muye كاملًا", confirmMailboxHelp: "اكتب البريد الظاهر أعلاه للتأكيد.", deletePermanently: "حذف نهائي", deletingMailbox: "جارٍ حذف البريد...", confirmMailboxMismatch: "اكتب بريد Muye الكامل كما هو ظاهر أعلاه تمامًا.", mailboxDeleteFailed: "تعذر حذف بريدك." });

Object.assign(mailboxText.en, { currentPasswordIncorrect: "Current password is incorrect." });
Object.assign(mailboxText.zh, { currentPasswordIncorrect: "当前密码不正确。" });
Object.assign(mailboxText.ja, { currentPasswordIncorrect: "現在のパスワードが正しくありません。" });
Object.assign(mailboxText.ko, { currentPasswordIncorrect: "현재 비밀번호가 올바르지 않습니다." });
Object.assign(mailboxText.es, { currentPasswordIncorrect: "La contraseña actual es incorrecta." });
Object.assign(mailboxText.fr, { currentPasswordIncorrect: "Le mot de passe actuel est incorrect." });
Object.assign(mailboxText.de, { currentPasswordIncorrect: "Das aktuelle Passwort ist falsch." });
Object.assign(mailboxText.pt, { currentPasswordIncorrect: "A senha atual está incorreta." });
Object.assign(mailboxText.ru, { currentPasswordIncorrect: "Текущий пароль неверен." });
Object.assign(mailboxText.ar, { currentPasswordIncorrect: "كلمة المرور الحالية غير صحيحة." });

function currentLanguage() {
  const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
  return mailboxText[saved] ? saved : "en";
}

function t(key, values = {}) {
  const source = mailboxText[currentLanguage()]?.[key] || mailboxText.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), source);
}

function setLabelText(label, text) {
  if (!label) return;
  const node = [...label.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
  if (node) node.textContent = text;
}

function applyMailboxLanguage() {
  const lang = currentLanguage();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelector(".home-link").textContent = t("home");
  document.querySelector("#mailbox-login .eyebrow").textContent = t("eyebrow");
  document.querySelector("#login-title").textContent = t("loginTitle");
  document.querySelector("#mailbox-login .mailbox-copy").textContent = t("loginCopy");
  setLabelText(document.querySelector('#login-form label:nth-of-type(1)'), t("email"));
  setLabelText(document.querySelector('#login-form label:nth-of-type(2)'), t("password"));
  document.querySelectorAll(".password-toggle").forEach((button) => { button.textContent = t("show"); button.setAttribute("aria-label", t("show")); });
  document.querySelector(".mailbox-keep-open span").textContent = t("openToday");
  document.querySelector('#login-form button[type="submit"]').textContent = t("openMailbox");
  document.querySelector(".mailbox-switch").innerHTML = `${t("needEmail")} <a href="/create-email">${t("createOne")}</a>`;
  document.querySelector("#reset-panel .eyebrow").textContent = t("recovery");
  document.querySelector("#reset-title").textContent = t("replacePassword");
  document.querySelector("#reset-panel .mailbox-copy").textContent = t("resetCopy");
  setLabelText(document.querySelector('#reset-form label:nth-of-type(1)'), t("verificationEmail"));
  setLabelText(document.querySelector('#reset-form label:nth-of-type(2)'), t("verificationCode"));
  document.querySelector('[name="code"]').placeholder = t("codePlaceholder");
  document.querySelector("#send-reset-code").textContent = t("sendCode");
  setLabelText(document.querySelector('#reset-form label:nth-of-type(3)'), t("newPassword"));
  setLabelText(document.querySelector('#reset-form label:nth-of-type(4)'), t("confirmPassword"));
  document.querySelector('#reset-form button[type="submit"]').textContent = t("replacePassword");
  document.querySelector("#back-to-login").textContent = t("backLogin");
  document.querySelector("#mailbox-app .eyebrow").textContent = t("eyebrow");
  document.querySelector("#show-change-password-button").textContent = t("changePassword");
  document.querySelector("#show-delete-mailbox-button").textContent = t("deleteOwnMailbox");
  document.querySelector("#change-password-title").textContent = t("changePassword");
  setLabelText(document.querySelector('#change-password-form label:nth-of-type(1)'), t("newPassword"));
  setLabelText(document.querySelector('#change-password-form label:nth-of-type(2)'), t("confirmPassword"));
  document.querySelector('#change-password-form button[type="submit"]').textContent = t("changePassword");
  document.querySelector("#cancel-change-password-button").textContent = t("cancel");
  document.querySelector("#delete-mailbox-title").textContent = t("deleteMailboxTitle");
  document.querySelector(".account-delete-warning").textContent = t("deleteMailboxWarning");
  setLabelText(document.querySelector('#delete-mailbox-form label:nth-of-type(1)'), t("currentPassword"));
  setLabelText(document.querySelector('#delete-mailbox-form label:nth-of-type(2)'), t("confirmMailbox"));
  document.querySelector(".account-delete-help").textContent = t("confirmMailboxHelp");
  document.querySelector('#delete-mailbox-form button[type="submit"]').textContent = t("deletePermanently");
  document.querySelector("#cancel-delete-mailbox-button").textContent = t("cancel");
  document.querySelector("#logout-button").textContent = t("signOut");
  document.querySelector("#inbox-view-button").textContent = t("inbox");
  document.querySelector("#outbox-view-button").textContent = t("outbox");
  document.querySelector("#trash-view-button").textContent = t("trash");
  document.querySelector("#messages-title").textContent = t("messages");
  document.querySelector("#refresh-button").textContent = t("refresh");
  document.querySelector("#preview-title").textContent = t("preview");
  document.querySelector("#close-preview-button").textContent = t("close");
  document.querySelector("#compose-title").textContent = t("newMessage");
  setLabelText(document.querySelector('#compose-form label:nth-of-type(1)'), t("to"));
  setLabelText(document.querySelector('#compose-form label:nth-of-type(2)'), t("subject"));
  setLabelText(document.querySelector('#compose-form label:nth-of-type(3)'), t("message"));
  setLabelText(document.querySelector('#compose-form label:nth-of-type(4)'), t("file"));
  composeForm.attachment.title = t("fileLimit");
  document.querySelector('#compose-form button[type="submit"]').textContent = t("sendMessage");
  document.querySelector("#mailbox-admin .eyebrow").textContent = t("admin");
  document.querySelector("#admin-title").textContent = t("allMailboxes");
  document.querySelector("#admin-refresh-button").textContent = t("refresh");
  document.querySelector("#admin-mailboxes-title").textContent = t("mailboxes");
  document.querySelector("#admin-requests-title").textContent = t("requests");
  document.querySelector("#admin-messages-title").textContent = t("messages");
  document.querySelector("#admin-preview-title").textContent = t("preview");
  document.querySelector("#admin-message-detail .empty-state").textContent = t("chooseMailbox");
  updateViewTabs();
}

const viewLabels = {
  inbox: () => t("inbox"),
  outbox: () => t("outbox"),
  trash: () => t("trash"),
};

const emptyText = {
  inbox: () => t("emptyInbox"),
  outbox: () => t("emptyOutbox"),
  trash: () => t("emptyTrash"),
};

function setMessage(element, text, error = false) {
  element.textContent = text;
  element.classList.toggle("error", error);
}

function formatDate(value) {
  return new Date(`${value}Z`).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function decodeStoredBody(value) {
  const text = String(value || "");
  if (!/=[0-9a-f]{2}|=\r?\n/i.test(text)) return text;
  const compact = text.replace(/=\r?\n/g, "");
  const bytes = [];
  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] === "=" && /^[0-9a-f]{2}$/i.test(compact.slice(index + 1, index + 3))) {
      bytes.push(parseInt(compact.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(compact.charCodeAt(index));
    }
  }
  try { return new TextDecoder("utf-8").decode(new Uint8Array(bytes)); } catch { return text; }
}

function renderMessages(messages) {
  if (!messages.length) {
    messageList.innerHTML = `<div class="empty-state">${emptyText[currentView]?.() || emptyText.inbox()}</div>`;
    messageDetail.innerHTML = `<p class="empty-state">${t("clickPreview")}</p>`;
    return;
  }
  messageList.innerHTML = messages.map((message) => `
    <button class="message-item ${message.is_read ? "" : "unread"}" data-message-id="${message.id}" type="button">
      <span class="message-meta"><span>${message.direction === "sent" ? t("to") + ": " : t("from") + ": "}${message.direction === "sent" ? message.recipient : message.sender}</span><time>${formatDate(message.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(message.subject)}</span>
      <span class="message-preview">${escapeHtml(decodeStoredBody(message.body))}</span>
    </button>`).join("");
  messageList.querySelectorAll("[data-message-id]").forEach((item) => {
    item.addEventListener("click", async () => {
      const message = messages.find((entry) => String(entry.id) === item.dataset.messageId);
      if (message) renderMessageDetail(message);
      if (message && !message.is_read) await updateMessage(message.id, "read", false);
      loadMessages();
    });
  });
}

function renderMessageDetail(message) {
  const counterpart = message.direction === "sent" ? `${t("to")}: ${message.recipient}` : `${t("from")}: ${message.sender}`;
  const attachment = renderAttachment(message);
  const htmlBody = renderHtmlBody(message);
  const textBody = `<pre ${htmlBody ? 'class="message-text-fallback"' : ""}>${escapeHtml(decodeStoredBody(message.body))}</pre>`;
  const readAction = message.is_read ? "unread" : "read";
  const readLabel = message.is_read ? t("markUnread") : t("markRead");
  const folderAction = currentView === "trash" ? "restore" : "trash";
  const folderLabel = currentView === "trash" ? t("restore") : t("moveTrash");
  const readButton = currentView === "outbox" ? "" : `<button class="mailbox-button quiet" type="button" data-message-action="${readAction}" data-message-id="${message.id}">${readLabel}</button>`;
  const folderButton = currentView === "outbox" ? "" : `<button class="mailbox-button quiet" type="button" data-message-action="${folderAction}" data-message-id="${message.id}">${folderLabel}</button>`;
  const quoteButton = `<button class="mailbox-button quiet" type="button" data-quote-message>${t("quote")}</button>`;
  const actions = `<div class="message-actions">${quoteButton}${readButton}${folderButton}</div>`;
  messageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(counterpart)}</span>
      <time>${formatDate(message.created_at)}</time>
    </div>
    <h3>${escapeHtml(message.subject)}</h3>
    ${htmlBody || textBody}
    ${attachment}
    ${actions}`;
  messageDetail.querySelectorAll("[data-message-action]").forEach((button) => {
    button.addEventListener("click", async () => updateMessage(button.dataset.messageId, button.dataset.messageAction));
  });
  messageDetail.querySelector("[data-quote-message]")?.addEventListener("click", () => quoteMessage(message));
  initializeHtmlFrames(messageDetail);
}

function renderAdminMessageDetail(message) {
  const attachment = renderAttachment(message);
  const htmlBody = renderHtmlBody(message);
  const textBody = `<pre ${htmlBody ? 'class="message-text-fallback"' : ""}>${escapeHtml(decodeStoredBody(message.body))}</pre>`;
  adminMessageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(message.sender)} -> ${escapeHtml(message.recipient)}</span>
      <time>${formatDate(message.created_at)}</time>
    </div>
    <h3>${escapeHtml(message.subject)}</h3>
    ${htmlBody || textBody}
    ${attachment}
    <div class="message-actions">
      <button class="mailbox-button admin-danger" type="button" data-admin-delete-message="${message.id}">${t("deleteMessage")}</button>
    </div>`;
  adminMessageDetail.querySelector("[data-admin-delete-message]")?.addEventListener("click", () => deleteAdminMessage(message.id));
  initializeHtmlFrames(adminMessageDetail);
}

function attachmentsForMessage(message) {
  try {
    const attachments = JSON.parse(message.attachments_json || "[]");
    if (Array.isArray(attachments) && attachments.length) return attachments;
  } catch {}
  if (!message.image_data || !message.image_type) return [];
  return [{ name: message.image_name || "attachment", type: message.image_type, data: message.image_data }];
}

function renderAttachment(message) {
  const attachments = attachmentsForMessage(message);
  if (!attachments.length) return "";
  return `<div class="message-attachments">${attachments.map((attachment) => {
    const name = attachment.name || "attachment";
    const type = attachment.type || "application/octet-stream";
    const src = `data:${escapeAttribute(type)};base64,${escapeAttribute(attachment.data || "")}`;
    const preview = type.startsWith("image/")
      ? `<img class="message-image" src="${src}" alt="${escapeAttribute(name)}">`
      : "";
    return `<div class="message-attachment">${preview}<a class="mailbox-button quiet attachment-link" href="${src}" download="${escapeAttribute(name)}">${t("download")} ${escapeHtml(name)}</a></div>`;
  }).join("")}</div>`;
}

function plainMessageText(message) {
  const text = decodeStoredBody(message.body).trim();
  if (text || !message.body_html) return text;
  const document = new DOMParser().parseFromString(message.body_html, "text/html");
  document.querySelectorAll("script, style, template, noscript").forEach((element) => element.remove());
  return (document.body.textContent || "").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function quoteMessage(message) {
  const sender = message.direction === "sent" ? message.recipient : message.sender;
  const attachmentNames = attachmentsForMessage(message)
    .map((attachment) => String(attachment.name || "attachment").replace(/[\r\n]+/g, " ").trim())
    .filter(Boolean);
  const attachmentText = attachmentNames.length
    ? `${t("quotedAttachments")}:\n${attachmentNames.map((name) => `- ${name}`).join("\n")}`
    : "";
  const quoteSource = [plainMessageText(message), attachmentText].filter(Boolean).join("\n\n");
  const quoted = quoteSource.slice(0, 7000).split("\n").map((line) => `> ${line}`).join("\n");
  const header = t("quotedHeader", { date: formatDate(message.created_at), sender });
  composeForm.elements.recipient.value = sender;
  composeForm.elements.subject.value = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`;
  composeForm.elements.body.value = `${header}\n${quoted}`.slice(0, 10000);
  document.querySelector(".compose-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  composeForm.elements.body.focus();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function cleanEmailCss(value) {
  return String(value || "")
    .replace(/@import[^;]+;?/gi, "")
    .replace(/url\s*\([^)]*\)/gi, "none")
    .replace(/expression\s*\([^)]*\)/gi, "")
    .replace(/javascript\s*:/gi, "");
}

function sanitizeEmailHtml(value) {
  const document = new DOMParser().parseFromString(String(value || ""), "text/html");
  document.querySelectorAll("script, iframe, object, embed, form, input, button, textarea, select, option, base, link, meta").forEach((element) => element.remove());
  document.querySelectorAll("style").forEach((element) => { element.textContent = cleanEmailCss(element.textContent); });
  document.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const content = attribute.value.trim();
      if (name.startsWith("on") || ["srcdoc", "formaction"].includes(name)) {
        element.removeAttribute(attribute.name);
      } else if (name === "style") {
        element.setAttribute("style", cleanEmailCss(content));
      } else if (name === "href" && !/^(https?:|mailto:)/i.test(content)) {
        element.removeAttribute(attribute.name);
      } else if (name === "src" && !/^(https:|data:image\/)/i.test(content)) {
        element.removeAttribute(attribute.name);
      }
    });
    if (element.tagName === "A" && element.hasAttribute("href")) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
    if (element.tagName === "IMG") element.setAttribute("loading", "lazy");
  });

  const policy = document.createElement("meta");
  policy.httpEquiv = "Content-Security-Policy";
  policy.content = "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https: data:; base-uri 'none'; form-action 'none'";
  const viewport = document.createElement("meta");
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1";
  const layout = document.createElement("style");
  layout.textContent = `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    html, body { min-width: 0; max-width: 100%; }
    body { margin: 0; padding: 8px; background: #fff; color: #111; font-family: Arial, sans-serif; font-size: 14px; }
    table { width: 100% !important; max-width: 100% !important; }
    img { max-width: 100% !important; height: auto !important; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; }
  `;
  document.head.prepend(policy, viewport, layout);
  return `<!doctype html>${document.documentElement.outerHTML}`;
}

function renderHtmlBody(message) {
  if (!message.body_html) return "";
  const source = escapeAttribute(sanitizeEmailHtml(message.body_html));
  return `<iframe class="message-html-frame" title="${escapeAttribute(message.subject || t("preview"))}" sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" referrerpolicy="no-referrer" srcdoc="${source}"></iframe>`;
}

function initializeHtmlFrames(root) {
  root.querySelectorAll(".message-html-frame").forEach((frame) => {
    const resize = () => {
      try {
        const content = frame.contentDocument;
        const height = Math.max(content.body?.scrollHeight || 0, content.documentElement?.scrollHeight || 0);
        frame.style.height = `${Math.min(Math.max(height, 180), 720)}px`;
      } catch {}
    };
    frame.addEventListener("load", resize, { once: true });
    if (frame.contentDocument?.readyState === "complete") requestAnimationFrame(resize);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "").split(",")[1] || ""));
    reader.addEventListener("error", () => reject(new Error("Could not read file.")));
    reader.readAsDataURL(file);
  });
}

function composeIdempotencyKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function loadMessages() {
  if (messagesLoading) {
    pendingView = currentView;
    return;
  }
  messagesLoading = true;
  try {
    const response = await fetch(`/api/mailbox-messages?view=${encodeURIComponent(currentView)}`, { cache: "no-store" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("muye_open_mail_today");
        if (notificationTimer) clearInterval(notificationTimer);
        notificationTimer = null;
        setMessage(loginMessage, result.error || t("signInPrompt"), true);
        showLogin();
        return;
      }
      setMessage(inboxMessage, result.error || t("refreshFailed"), true);
      return;
    }
    setMessage(inboxMessage, "");
    address.textContent = result.mailbox;
    currentView = result.view || currentView;
    updateViewTabs();
    const messages = result.messages || [];
    if (currentView === "inbox") watchMailboxNotifications(messages);
    renderMessages(messages);
  } catch (error) {
    setMessage(inboxMessage, t("refreshFailedLong"), true);
    console.error(error);
  } finally {
    messagesLoading = false;
    if (pendingView) {
      const nextView = pendingView;
      pendingView = null;
      if (nextView !== currentView) {
        currentView = nextView;
        loadMessages();
      }
    }
  }
}

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load.");
}

async function adminHeaders() {
  if (!adminToken) adminToken = await window.Clerk?.session?.getToken?.();
  return adminToken ? { authorization: `Bearer ${adminToken}` } : {};
}

async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), ...(await adminHeaders()) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || t("adminFailed"));
  return result;
}

function renderAdminMailboxes(mailboxes) {
  adminSummary.textContent = `${mailboxes.length} ${t("mailboxes").toLowerCase()}`;
  if (!mailboxes.length) {
    adminMailboxList.innerHTML = `<div class="empty-state">${t("noMailboxes")}</div>`;
    return;
  }
  adminMailboxList.innerHTML = mailboxes.map((mailbox) => `
    <button class="message-item ${mailbox.banned_at ? "unread" : ""}" data-admin-mailbox="${escapeAttribute(mailbox.mailbox)}" type="button">
      <span class="message-meta"><span>${escapeHtml(mailbox.mailbox)}</span><time>${formatDate(mailbox.created_at)}</time></span>
      <span class="message-subject">${mailbox.banned_at ? `<span class="admin-banned">${t("banned")}</span>` : t("active")}</span>
      <span class="admin-mailbox-counts">
        <span>${Number(mailbox.message_count || 0)} ${t("messages").toLowerCase()}</span>
        <span>${Number(mailbox.inbox_count || 0)} ${t("inbox").toLowerCase()}</span>
        <span>${Number(mailbox.sent_count || 0)} ${t("outbox").toLowerCase()}</span>
      </span>
    </button>`).join("");
  adminMailboxList.querySelectorAll("[data-admin-mailbox]").forEach((button) => {
    button.addEventListener("click", () => loadAdminMailbox(button.dataset.adminMailbox));
  });
}

function renderAdminRequests(requests) {
  if (!adminRequestList) return;
  if (!requests.length) {
    adminRequestList.innerHTML = `<div class="empty-state">${t("noRequests")}</div>`;
    return;
  }
  adminRequestList.innerHTML = requests.map((request) => `
    <button class="message-item ${request.status === "open" ? "unread" : ""}" data-admin-request-id="${request.id}" type="button">
      <span class="message-meta"><span>${escapeHtml(request.email_name)}@muye.dev</span><time>${formatDate(request.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(request.requester_email || request.requester_name || t("request"))}</span>
      <span class="message-preview">${escapeHtml(request.request_text)}</span>
    </button>`).join("");
  adminRequestList.querySelectorAll("[data-admin-request-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = requests.find((entry) => String(entry.id) === button.dataset.adminRequestId);
      if (!request) return;
      selectedAdminMailbox = "";
      adminMessageList.innerHTML = `<div class="empty-state">${t("chooseMailboxInspect")}</div>`;
      adminMessageDetail.innerHTML = `
        <div class="message-detail-meta">
          <span>${escapeHtml(request.email_name)}@muye.dev</span>
          <time>${formatDate(request.created_at)}</time>
        </div>
        <h3>${t("request")}</h3>
        <pre>${escapeHtml(request.request_text)}</pre>
        <p class="empty-state">${escapeHtml(request.requester_email || request.requester_name || t("noRequester"))}</p>
        ${request.status === "open" ? `
          <div class="message-actions">
            <button class="mailbox-button quiet" type="button" data-approve-request="${request.id}">${t("approveRequest")}</button>
          </div>` : ""}`;
      adminMessageDetail.querySelector("[data-approve-request]")?.addEventListener("click", () => approveRequest(request.id));
    });
  });
}

async function approveRequest(requestId) {
  try {
    setMessage(adminMessage, t("approving"));
    const result = await adminFetch("/api/admin-mailboxes", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "approve-request", requestId }),
    });
    setMessage(adminMessage, `${t("approved")}: ${result.mailbox}`);
    await loadAdminMailboxes();
  } catch (error) {
    setMessage(adminMessage, error.message || t("adminFailed"), true);
  }
}

function renderAdminMessages(mailbox, messages) {
  selectedAdminMailbox = mailbox.mailbox;
  const banLabel = mailbox.banned_at ? t("unbanMailbox") : t("banMailbox");
  const banAction = mailbox.banned_at ? "unban" : "ban";
  adminMessageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(mailbox.mailbox)}</span>
      <time>${formatDate(mailbox.created_at)}</time>
    </div>
    <h3>${mailbox.banned_at ? `<span class="admin-banned">${t("bannedMailbox")}</span>` : t("mailboxControls")}</h3>
    <div class="message-actions">
      <button class="mailbox-button quiet" type="button" data-admin-mailbox-action="${banAction}">${banLabel}</button>
      <button class="mailbox-button admin-danger" type="button" data-admin-delete-mailbox>${t("deleteMailbox")}</button>
    </div>`;
  adminMessageDetail.querySelector("[data-admin-mailbox-action]")?.addEventListener("click", () => updateAdminMailbox(banAction));
  adminMessageDetail.querySelector("[data-admin-delete-mailbox]")?.addEventListener("click", deleteAdminMailbox);

  if (!messages.length) {
    adminMessageList.innerHTML = `<div class="empty-state">${t("noMailboxMessages")}</div>`;
    return;
  }
  adminMessageList.innerHTML = messages.map((message) => `
    <button class="message-item ${message.is_read ? "" : "unread"}" data-admin-message-id="${message.id}" type="button">
      <span class="message-meta"><span>${message.direction === "sent" ? t("outbox") : t("inbox")}</span><time>${formatDate(message.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(message.subject)}</span>
      <span class="message-preview">${escapeHtml(message.sender)} -> ${escapeHtml(message.recipient)}</span>
    </button>`).join("");
  adminMessageList.querySelectorAll("[data-admin-message-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const message = messages.find((entry) => String(entry.id) === button.dataset.adminMessageId);
      if (message) renderAdminMessageDetail(message);
    });
  });
}

async function loadAdminMailboxes() {
  try {
    setMessage(adminMessage, "");
    const result = await adminFetch("/api/admin-mailboxes");
    renderAdminMailboxes(result.mailboxes || []);
    renderAdminRequests(result.requests || []);
  } catch (error) {
    admin.hidden = true;
    if (error.message !== "Admin access required.") console.error(error);
  }
}

async function loadAdminMailbox(mailbox) {
  try {
    setMessage(adminMessage, t("loading"));
    const result = await adminFetch(`/api/admin-mailboxes?mailbox=${encodeURIComponent(mailbox)}`);
    renderAdminMessages(result.mailbox, result.messages || []);
    setMessage(adminMessage, "");
  } catch (error) {
    setMessage(adminMessage, error.message || t("loadMailboxFailed"), true);
  }
}

async function updateAdminMailbox(action) {
  if (!selectedAdminMailbox) return;
  try {
    await adminFetch("/api/admin-mailboxes", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mailbox: selectedAdminMailbox, action }),
    });
    await loadAdminMailboxes();
    await loadAdminMailbox(selectedAdminMailbox);
  } catch (error) {
    setMessage(adminMessage, error.message || t("updateMailboxFailed"), true);
  }
}

async function deleteAdminMessage(id) {
  if (!confirm(t("deleteMessageAsk"))) return;
  try {
    await adminFetch(`/api/admin-mailboxes?messageId=${encodeURIComponent(id)}`, { method: "DELETE" });
    adminMessageDetail.innerHTML = `<p class="empty-state">${t("messageDeleted")}</p>`;
    await loadAdminMailbox(selectedAdminMailbox);
    await loadAdminMailboxes();
  } catch (error) {
    setMessage(adminMessage, error.message || t("deleteMessageFailed"), true);
  }
}

async function deleteAdminMailbox() {
  if (!selectedAdminMailbox || !confirm(`${t("deleteMailboxAsk")} ${selectedAdminMailbox}`)) return;
  try {
    await adminFetch(`/api/admin-mailboxes?mailbox=${encodeURIComponent(selectedAdminMailbox)}`, { method: "DELETE" });
    selectedAdminMailbox = "";
    adminMessageList.innerHTML = `<div class="empty-state">${t("mailboxDeleted")}</div>`;
    adminMessageDetail.innerHTML = `<p class="empty-state">${t("chooseMailbox")}</p>`;
    await loadAdminMailboxes();
  } catch (error) {
    setMessage(adminMessage, error.message || t("deleteMailboxFailed"), true);
  }
}

async function showAdminIfAllowed() {
  try {
    await adminFetch("/api/admin-mailboxes");
    admin.hidden = false;
    await loadAdminMailboxes();
    return;
  } catch {}

  try {
    const clerk = await waitForClerk();
    await clerk.load();
    if (!clerk.isSignedIn) throw new Error("not signed in");
    adminToken = await clerk.session?.getToken?.();
    await adminFetch("/api/admin-mailboxes");
    admin.hidden = false;
    await loadAdminMailboxes();
  } catch {
    admin.hidden = true;
  }
}

function notifyIncoming(message) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(`${t("newMailFrom")} ${message.sender}`, {
    body: `${message.subject}\n${decodeStoredBody(message.body).slice(0, 120)}`,
    tag: `muye-mail-${message.id}`,
  });
}

async function enableNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") await Notification.requestPermission();
}

function watchMailboxNotifications(messages) {
  const incoming = messages.filter((message) => message.direction === "inbox");
  const maxId = Math.max(0, ...incoming.map((message) => Number(message.id) || 0));
  if (hasLoadedInboxOnce && maxId > newestInboxId) {
    incoming
      .filter((message) => Number(message.id) > newestInboxId)
      .sort((a, b) => Number(a.id) - Number(b.id))
      .forEach(notifyIncoming);
  }
  newestInboxId = Math.max(newestInboxId, maxId);
  hasLoadedInboxOnce = true;
}

function startNotificationPolling() {
  enableNotifications();
  if (notificationTimer) return;
  notificationTimer = setInterval(() => {
    if (!app.hidden && currentView === "inbox") loadMessages();
  }, 45000);
}

async function updateMessage(id, action, refreshDetail = true) {
  const response = await fetch("/api/mailbox-messages", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: Number(id), action }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    setMessage(inboxMessage, result.error || "Could not update message.", true);
    return false;
  }
  setMessage(inboxMessage, "");
  if (refreshDetail) messageDetail.innerHTML = `<p class="empty-state">${t("clickPreview")}</p>`;
  await loadMessages();
  return true;
}

function updateViewTabs() {
  mailboxTitle.textContent = viewLabels[currentView]?.() || viewLabels.inbox();
  viewButtons.forEach((button) => {
    const selected = button.dataset.view === currentView;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function showApp(mailbox) {
  login.hidden = true;
  app.hidden = false;
  address.textContent = mailbox || "";
  startNotificationPolling();
  loadMessages();
}

function autoOpenApp() {
  login.hidden = true;
  app.hidden = false;
  startNotificationPolling();
  loadMessages();
}

function showLogin() {
  login.hidden = false;
  app.hidden = true;
  deleteMailboxPanel.hidden = true;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, t("opening"));
  const formData = new FormData(loginForm);
  const openForToday = formData.get("openForToday") === "on";
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  const captcha = window.muyeCaptchaToken || muyeCaptchaToken || String(formData.get("cf-turnstile-response") || document.querySelector('input[name="cf-turnstile-response"]')?.value || window.turnstile?.getResponse?.() || "");
  if (!captcha) {
    setMessage(loginMessage, t("waitCaptcha"), true);
    return;
  }
  try {
    const response = await fetch("/api/mailbox-login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mailbox: formData.get("mailbox"), password: formData.get("password"), captcha, openForToday, expiresAt: tomorrow.getTime() }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      window.turnstile?.reset?.();
      window.muyeCaptchaExpired();
      setMessage(loginMessage, result.error || t("openFailed"), true);
      return;
    }
    loginForm.reset();
    window.muyeCaptchaExpired();
    if (openForToday) localStorage.setItem("muye_open_mail_today", todayKey);
    else localStorage.removeItem("muye_open_mail_today");
    showApp(result.mailbox);
  } catch (error) {
    window.turnstile?.reset?.();
    window.muyeCaptchaExpired();
    setMessage(loginMessage, error.message || t("openFailed"), true);
  }
});

function togglePassword(input, button) {
  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  button.textContent = visible ? t("show") : t("hide");
}

document.querySelector("#login-password-toggle").addEventListener("click", (event) => togglePassword(document.querySelector("#login-password"), event.currentTarget));
document.querySelectorAll("[data-reset-toggle]").forEach((button) => button.addEventListener("click", () => togglePassword(button.previousElementSibling, button)));

document.querySelector("#back-to-login").addEventListener("click", () => { resetPanel.hidden = true; login.hidden = false; });
document.querySelector("#show-change-password-button").addEventListener("click", () => { deleteMailboxPanel.hidden = true; changePasswordPanel.hidden = false; changePasswordForm.querySelector('input[name="password"]').focus(); });
document.querySelector("#cancel-change-password-button").addEventListener("click", () => { changePasswordForm.reset(); changePasswordPanel.hidden = true; setMessage(changePasswordMessage, ""); });
document.querySelectorAll("[data-change-password-toggle]").forEach((button) => button.addEventListener("click", () => togglePassword(button.previousElementSibling, button)));
document.querySelector("#show-delete-mailbox-button").addEventListener("click", () => {
  changePasswordPanel.hidden = true;
  deleteMailboxPanel.hidden = false;
  deleteMailboxForm.confirmation.placeholder = address.textContent || "you@muye.dev";
  deleteMailboxForm.querySelector('input[name="password"]').focus();
});
document.querySelector("#cancel-delete-mailbox-button").addEventListener("click", () => { deleteMailboxForm.reset(); deleteMailboxPanel.hidden = true; setMessage(deleteMailboxMessage, ""); });
document.querySelectorAll("[data-delete-password-toggle]").forEach((button) => button.addEventListener("click", () => togglePassword(button.previousElementSibling, button)));

deleteMailboxForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(deleteMailboxForm);
  const confirmation = String(data.get("confirmation") || "").trim().toLowerCase();
  if (!address.textContent || confirmation !== address.textContent.trim().toLowerCase()) {
    setMessage(deleteMailboxMessage, t("confirmMailboxMismatch"), true);
    return;
  }
  const button = deleteMailboxForm.querySelector('button[type="submit"]');
  button.disabled = true;
  setMessage(deleteMailboxMessage, t("deletingMailbox"));
  try {
    const response = await fetch("/api/delete-mailbox", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: data.get("password"), confirmation }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const localizedError = result.code === "password_incorrect"
        ? t("currentPasswordIncorrect")
        : result.code === "confirmation_mismatch" ? t("confirmMailboxMismatch") : result.error;
      throw new Error(localizedError || t("mailboxDeleteFailed"));
    }
    localStorage.removeItem("muye_open_mail_today");
    if (notificationTimer) clearInterval(notificationTimer);
    notificationTimer = null;
    deleteMailboxForm.reset();
    deleteMailboxPanel.hidden = true;
    showLogin();
    setMessage(loginMessage, t("mailboxDeleted"));
  } catch (error) {
    setMessage(deleteMailboxMessage, error.message || t("mailboxDeleteFailed"), true);
  } finally {
    button.disabled = false;
  }
});

changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(changePasswordForm);
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("passwordConfirm") || "");
  if (password.length < 8 || !/\d/.test(password) || password !== confirmation) {
    setMessage(changePasswordMessage, password !== confirmation ? t("passwordMismatch") : t("passwordShort"), true);
    return;
  }
  const button = changePasswordForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const response = await fetch("/api/change-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("changePasswordFailed"));
    changePasswordForm.reset();
    setMessage(changePasswordMessage, t("passwordChanged"));
  } catch (error) {
    setMessage(changePasswordMessage, error.message || t("changePasswordFailed"), true);
  } finally {
    button.disabled = false;
  }
});

let resetChallenge = "";
async function sendResetCode() {
  const data = new FormData(resetForm);
  const email = String(data.get("contactEmail") || "").trim();
  if (!email) { setMessage(resetMessage, t("enterEmail"), true); return false; }
  const response = await fetch("/api/send-email-code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
  const result = await response.json();
  if (!response.ok) { setMessage(resetMessage, result.error || t("codeSendFailed"), true); return false; }
  resetChallenge = result.challenge;
  setMessage(resetMessage, t("codeSent"));
  return true;
}

document.querySelector("#send-reset-code").addEventListener("click", sendResetCode);

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(resetForm);
  const email = String(data.get("contactEmail") || "").trim();
  const code = String(data.get("code") || "").trim();
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("passwordConfirm") || "");
  if (!resetChallenge) {
    const sent = await sendResetCode();
    if (!sent) return;
    setMessage(resetMessage, t("codeSentNext"));
    return;
  }
  if (!code) { setMessage(resetMessage, t("enterCode"), true); return; }
  if (password.length < 8 || !/\d/.test(password) || password !== confirmation) { setMessage(resetMessage, password !== confirmation ? t("passwordMismatch") : t("passwordShort"), true); return; }
  const verifyResponse = await fetch("/api/verify-email-code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, code, challenge: resetChallenge }) });
  const verifyResult = await verifyResponse.json();
  if (!verifyResponse.ok) { setMessage(resetMessage, verifyResult.error || t("codeInvalid"), true); return; }
  const response = await fetch("/api/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password, proof: verifyResult.proof }) });
  const result = await response.json();
  if (!response.ok) { setMessage(resetMessage, result.error || t("replaceFailed"), true); return; }
  resetForm.reset();
  resetChallenge = "";
  setMessage(resetMessage, t("replaced"));
});

function renderSelectedAttachments() {
  composeAttachments.hidden = selectedAttachments.length === 0;
  composeAttachments.innerHTML = selectedAttachments.map((attachment, index) => {
    const preview = attachment.type.startsWith("image/")
      ? `<img src="data:${escapeAttribute(attachment.type)};base64,${escapeAttribute(attachment.data)}" alt="">`
      : `<span class="compose-file-icon" aria-hidden="true">+</span>`;
    return `<div class="compose-attachment">${preview}<span><strong>${escapeHtml(attachment.name)}</strong><small>${Math.ceil(attachment.size / 1024)} KB</small></span><button type="button" data-remove-attachment="${index}" title="${escapeAttribute(t("removeFile"))}" aria-label="${escapeAttribute(t("removeFile"))}">×</button></div>`;
  }).join("");
  composeAttachments.querySelectorAll("[data-remove-attachment]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAttachments.splice(Number(button.dataset.removeAttachment), 1);
      renderSelectedAttachments();
    });
  });
}

composeForm.attachment.addEventListener("change", async () => {
  const files = [...(composeForm.attachment.files || [])];
  composeForm.attachment.value = "";
  if (!files.length) return;
  if (selectedAttachments.length + files.length > 5) {
    setMessage(composeMessage, t("tooManyFiles"), true);
    return;
  }
  const totalSize = selectedAttachments.reduce((sum, file) => sum + file.size, 0) + files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > 4 * 1024 * 1024) {
    setMessage(composeMessage, t("filesTooLarge"), true);
    return;
  }
  try {
    const additions = await Promise.all(files.map(async (file) => ({ name: file.name, type: file.type || "application/octet-stream", size: file.size, data: await fileToBase64(file) })));
    selectedAttachments.push(...additions);
    renderSelectedAttachments();
    setMessage(composeMessage, "");
  } catch (error) {
    setMessage(composeMessage, error.message || t("fileLoadFailed"), true);
  }
});

composeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (composeSending) return;
  composeSending = true;
  const submitButton = composeForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  setMessage(composeMessage, t("sending"));
  const formData = new FormData(composeForm);
  const idempotencyKey = composeIdempotencyKey();
  try {
    const attachments = selectedAttachments.map(({ name, type, data }) => ({ name, type, data }));
    const response = await fetch("/api/mailbox-messages", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": idempotencyKey }, body: JSON.stringify({ recipient: formData.get("recipient"), subject: formData.get("subject"), body: formData.get("body"), attachments, idempotencyKey }) });
    const result = await response.json();
    if (!response.ok) { setMessage(composeMessage, result.error || t("sendFailed"), true); return; }
    composeForm.reset();
    selectedAttachments = [];
    renderSelectedAttachments();
    setMessage(composeMessage, t("sent"));
    loadMessages();
  } finally {
    composeSending = false;
    if (submitButton) submitButton.disabled = false;
  }
});

document.querySelector("#refresh-button").addEventListener("click", loadMessages);
document.querySelector("#admin-refresh-button").addEventListener("click", loadAdminMailboxes);
viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view === "outbox" || button.dataset.view === "trash" ? button.dataset.view : "inbox";
    messageDetail.innerHTML = `<p class="empty-state">${t("clickPreview")}</p>`;
    updateViewTabs();
    loadMessages();
  });
});
document.querySelector("#close-preview-button").addEventListener("click", () => {
  messageDetail.innerHTML = `<p class="empty-state">${t("clickPreview")}</p>`;
});
document.querySelector("#logout-button").addEventListener("click", async () => {
  await fetch("/api/mailbox-login", { method: "DELETE" });
  localStorage.removeItem("muye_open_mail_today");
  if (notificationTimer) clearInterval(notificationTimer);
  notificationTimer = null;
  showLogin();
});

applyMailboxLanguage();

async function restoreMailboxSession() {
  if (localStorage.getItem("muye_open_mail_today") === todayKey) {
    autoOpenApp();
    return;
  }
  try {
    const response = await fetch("/api/mailbox-messages?view=inbox", { cache: "no-store" });
    if (response.ok) {
      localStorage.setItem("muye_open_mail_today", todayKey);
      autoOpenApp();
      return;
    }
  } catch {}
  showLogin();
}

restoreMailboxSession();

showAdminIfAllowed();
