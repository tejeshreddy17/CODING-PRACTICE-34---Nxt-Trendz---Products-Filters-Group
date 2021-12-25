import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const apistatusObject = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategory: '',
    activeRating: '',
    searchInput: '',
    apistatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategory,
      activeRating,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategory}&title_search=${searchInput}&rating=${activeRating}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        apistatus: apistatusObject.success,
      })
    } else {
      this.setState({apistatus: apistatusObject.failure, isLoading: false})
    }
  }

  displayCategory = category => {
    const categoryIdObject = categoryOptions.filter(
      eachCategory => eachCategory.name === category,
    )

    this.setState(
      {activeCategory: categoryIdObject[0].categoryId},
      this.getProducts,
    )
  }

  displayRating = rating => {
    console.log(rating)
    this.setState({activeRating: rating}, this.getProducts)
  }

  updatingsearchInput = search => {
    this.setState({searchInput: search})
  }

  onClickingEnter = () => {
    this.getProducts()
  }

  clickfilter = () => {
    this.setState(
      {activeCategory: '', activeRating: '', searchInput: ''},
      this.getProducts,
    )
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, searchInput, apistatus} = this.state

    // TODO: Add No Products View

    return (
      <div className="all-products-container">
        {apistatus === 'SUCCESS' ? (
          <>
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
              updatingsearchInput={this.updatingsearchInput}
              onClickingEnter={this.onClickingEnter}
              searchInput={searchInput}
            />
            {productsList.length > 0 ? (
              <ul className="products-list">
                {productsList.map(product => (
                  <ProductCard productData={product} key={product.id} />
                ))}
              </ul>
            ) : (
              <img
                alt=" no products"
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              />
            )}
          </>
        ) : (
          <img
            alt="products failure"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          />
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          displayCategory={this.displayCategory}
          ratingsList={ratingsList}
          displayRating={this.displayRating}
          clickfilter={this.clickfilter}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
