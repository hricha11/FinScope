import axios from 'axios'

export const predictSpending = async (token: string) => {
  const res = await axios.get('http://localhost:8080/api/predict', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}
