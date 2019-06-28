import axios from 'axios'

export default class TakingEndpoints {

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

    get(successHandler, errorHandler, page, sort) {
        axios.post(
            '/backend/stream/takings',
            { "page": page, "sort": sort },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    count(successHandler, errorHandler, page, sort) {
        axios.post(
            "/backend/stream/takings/count",
            { "page": page, "sort": sort },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    save(successHandler, errorHandler, taking) {
        axios.post(
            '/backend/stream/takings/create',
            taking,
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
}