import React from 'react'
import axios from 'axios'



const headers = { 'Content-Type': 'application/json' }
const api = 'http://172.17.15.150:3000'

const customAxios = axios.create({
    baseURL:api, 
    timeout: 5000, 
    headers: headers
  });
export default class ServiceHelper extends React.Component {
	state = {
		loading: false,
		error: null,
		payload: null
	}

	validateAndRespond = (res) => {
		// setTimeout(() => {
		if (res && res.Success) {
			this.setState({ loading: false, payload: res.response, error: null })
		} else {
			this.setState({ loading: false, payload: res.response, error: res.Message })
		}
		// }, 10)
	}
   
	componentDidMount () {
		const { method, path, input, optHeaders } = this.props
		this.setState({ loading: true })
		if (!method || method === 'get') {
            // console.log(`${api}/${path}`,"37");
			customAxios({ method: 'get', url: `${api}/${path}`, timeout: 30000, params: input })
				.then((response) => {
                    // console.log(response,"40");
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'post') {
			//console.log(optHeaders)
			//console.log(input)
			customAxios
				.post(`${api}/${path}`, input, { headers: optHeaders ? optHeaders : headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'put') {
			customAxios
				.put(`${api}/${path}`, input, { headers: headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'delete') {
			customAxios
				.delete(`${api}/${path}`, null, { headers: headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
	}

	render () {
		return this.props.render(this.state)
	}
}
