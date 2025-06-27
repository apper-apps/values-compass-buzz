import valueData from '@/services/mockData/values.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let values = [...valueData]

export const valueService = {
  async getAll() {
    await delay(300)
    return [...values]
  },

  async getById(id) {
    await delay(200)
    const value = values.find(v => v.Id === parseInt(id, 10))
    if (!value) {
      throw new Error('Value not found')
    }
    return { ...value }
  },

  async getTopValues(limit = 5) {
    await delay(250)
    return [...values]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(v => ({ ...v }))
  },

  async create(valueData) {
    await delay(400)
    const maxId = Math.max(...values.map(v => v.Id), 0)
    const newValue = {
      ...valueData,
      Id: maxId + 1
    }
    values.push(newValue)
    return { ...newValue }
  },

  async update(id, valueData) {
    await delay(350)
    const index = values.findIndex(v => v.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Value not found')
    }
    
    const updatedValue = {
      ...values[index],
      ...valueData,
      Id: values[index].Id // Preserve original Id
    }
    
    values[index] = updatedValue
    return { ...updatedValue }
  },

  async delete(id) {
    await delay(300)
    const index = values.findIndex(v => v.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Value not found')
    }
    
    const deletedValue = { ...values[index] }
    values.splice(index, 1)
    return deletedValue
  }
}

export default valueService