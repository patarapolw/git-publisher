if (!localStorage.getItem('404-location')) {
  localStorage.setItem('404-location', JSON.stringify(location))
  location.href = `${process.env.BASE_URL}index.html`
}
