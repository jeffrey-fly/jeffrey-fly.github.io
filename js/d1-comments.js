document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("comments-container");
  const form = document.getElementById("comment-form");
  if (!container || !form) return;

  const postId = window.location.pathname.replace(/^\/|\/$/g, '');
  let lastSubmitTime = 0; // 前端防刷

  function renderComment(comment) {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <div class="comment-author">${comment.author}</div>
      <div class="comment-date">${new Date(comment.created_at).toLocaleString()}</div>
      <div class="comment-content">${comment.content}</div>
    `;
    return div;
  }

  async function loadComments() {
    const res = await fetch(`https://broken-tooth-8c62.gujinfei.workers.dev/comments?post_id=${postId}`);
    const comments = await res.json();
    container.innerHTML = "";
    comments.forEach(c => container.appendChild(renderComment(c)));
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTime < 30_000) { // 30 秒冷却
      alert("请勿频繁提交评论，30 秒后再试");
      return;
    }

    const author = form.author.value.trim();
    const content = form.content.value.trim();
    if (!author || !content) return;

    await fetch("https://broken-tooth-8c62.gujinfei.workers.dev/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, author, content })
    });

    form.reset();
    lastSubmitTime = now;
    loadComments();
  });

  loadComments();
});
