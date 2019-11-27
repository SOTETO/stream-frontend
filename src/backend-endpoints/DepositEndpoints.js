import axios from 'axios'

export default class DepositEndpoints {

    constructor(store) {
        this.store = store

        this.defaultErrorHandler = function (error, errorHandler) {
            console.log(error)
            switch (error.response.code) {
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
            '/backend/stream/deposits',
            { "page": page, "sort": sort, "filter": filter },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
            .then(response => successHandler(response))
            .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    count(successHandler, errorHandler, page, sort, filter) {
        axios.post(
            "/backend/stream/deposits/count",
            { "page": page, "sort": sort, "filter": filter },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
        )
            .then(response => successHandler(response))
            .catch(error => this.defaultErrorHandler(error, errorHandler))
    }

    save(successHandler, errorHandler, deposit) {
        axios.post(
            '/backend/stream/deposits/create',
            deposit,
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
            .then(response => successHandler(response))
            .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
    
    confirm(successHandler, errorHandler, deposit) {
        axios.post(
            "/backend/stream/deposits/confirm",
            { "id": deposit.id, "date": Date.now() },
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
            .then(response => successHandler(response))
            .catch(error => this.defaultErrorHandler(error, errorHandler))
    }
}
