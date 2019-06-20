import axios from 'axios'

export default class DepositEndpoints {

    constructor(store) {
        this.store = store

        var defaultErrorHandler = function (error, errorHandler) {
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

    get(successHandler, errorHandler) {
        axios.get(
            '/backend/stream/deposits',
           // { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
            .then(response => successHandler(response))
            .catch(error => defaultErrorHandler(error, errorHandler))
    }

    save(successHandler, errorHandler, deposit) {
        axios.post(
            '/backend/stream/deposit/create',
            deposit,
            { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        )
            .then(response => successHandler(response))
            .catch(error => defaultErrorHandler(error, errorHandler))
    }
}