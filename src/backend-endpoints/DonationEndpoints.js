import axios from 'axios'

export default class DonationEndpoints {

    constructor(store) {
        this.store = store

        this.defaultErrorHandler = function(error, errorHandler) {
            switch(error.response.code) {
                case 401:
                    this.store.root.dispatch('user/logout')
                    break;
                default:
                    errorHandler(error)
                    break;
            }
        }
    }

    get(successHandler, errorHandler, page, sort, filter) {
        axios.post(
            '/backend/stream/takings',
            { "page": page, "sort": sort, "filter": filter },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    getByQuery(successHandler, errorHandler, searchKey) {
        axios.post(
            '/backend/stream/takings',
            { "filter": { "name": searchKey } },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    getByIds(successHandler, errorHandler, ids) {
        axios.post(
            '/backend/stream/takings',
            { "filter": { "publicId": ids } },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    getById(successHandler, errorHandler, id) {
      axios.get(
        '/backend/stream/takings/id/' + id,
        { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
      )
      .then(response => successHandler(response))
      .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    count(successHandler, errorHandler, page, sort, filter) {
        axios.post(
            "/backend/stream/takings/count",
            { "page": page, "sort": sort, 'filter': filter },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    save(successHandler, errorHandler, donation) {
        axios.post(
            '/backend/stream/takings/create',
            donation,
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
  update(successHandler, errorHandler, taking) {
    axios.post(
      '/backend/stream/takings/update',
      taking,
      { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
    )
      .then(response => successHandler(response))
      .catch(error => this.defaultErrorHandler(error, errorHandler))
  }
}
