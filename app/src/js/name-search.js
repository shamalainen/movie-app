const onFormSubmit = (e) => {
  e.preventDefault();
  const { nameSearch } = e.target;
  console.log(nameSearch.value);
}