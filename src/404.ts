if (!/404\.html$/.test(location.pathname)) {
  localStorage.setItem('404-location', JSON.stringify(location))
  location.href = new URL(`${process.env.BASE_URL}index.html`, location.origin).href
} else {
  document.getElementsByTagName('title')[0].innerText = "The page you were looking for doesn't exist (404)"
  document.getElementById('app')!.classList.remove('hidden')
}
