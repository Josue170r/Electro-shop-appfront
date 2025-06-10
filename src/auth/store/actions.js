// user/store/actions.js
import axios from 'axios'

export const registerUser = async ({ commit }, userData) => {
  try {
    console.log(userData)
    const response = await axios.post('/alta_usuario', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al registrar usuario')
  }
}