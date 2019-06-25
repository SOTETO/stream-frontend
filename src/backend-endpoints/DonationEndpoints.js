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

    get(successHandler, errorHandler, page, sort) {
        axios.post(
            '/backend/stream/donations',
            { "page": page, "sort": sort },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    getByQuery(successHandler, errorHandler, searchKey) {
        axios.post(
            '/backend/stream/donations',
            { "filter": { "name": searchKey } },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    getByIds(successHandler, errorHandler, ids) {
        axios.post(
            '/backend/stream/donations',
            { "filter": { "publicId": ids } },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    count(successHandler, errorHandler, page, sort) {
        axios.post(
            "/backend/stream/donations/count",
            { "page": page, "sort": sort },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    save(successHandler, errorHandler, donation) {
        axios.post(
            '/backend/stream/donations/create',
            donation,
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
        .then(response => successHandler(response))
        .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
}