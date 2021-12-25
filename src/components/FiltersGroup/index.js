import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    displayCategory,
    ratingsList,
    displayRating,
    clickfilter,
  } = props
  const clickingCategory = event => {
    displayCategory(event.target.textContent)
    console.log(event)
  }
  const clickingRating = event => {
    displayRating(event.target.alt.split(' ')[1])
    console.log(event.target.alt.split(' ')[1])
  }
  const onClickClearFilters = () => {
    clickfilter()
  }
  return (
    <div className="filters-group-container">
      <h1>Category</h1>
      {categoryOptions.map(eachcategory => (
        <p onClick={clickingCategory}>{eachcategory.name}</p>
      ))}
      {ratingsList.map(eachrating => (
        <button
          onClick={clickingRating}
          value={eachrating.ratingId}
          type="button"
        >
          <img
            alt={`rating ${eachrating.ratingId}`}
            src={eachrating.imageUrl}
          />
        </button>
      ))}
      <button type="button" onClick={onClickClearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
