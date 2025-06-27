import questionData from '@/services/mockData/questions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let questions = [...questionData]

export const questionService = {
  async getAll() {
    await delay(300)
    return [...questions]
  },

  async getById(id) {
    await delay(200)
    const question = questions.find(q => q.Id === parseInt(id, 10))
    if (!question) {
      throw new Error('Question not found')
    }
    return { ...question }
  },

  async getByCategory(category) {
    await delay(250)
    return questions.filter(q => q.category === category).map(q => ({ ...q }))
  },

  async create(questionData) {
    await delay(400)
    const maxId = Math.max(...questions.map(q => q.Id), 0)
    const newQuestion = {
      ...questionData,
      Id: maxId + 1
    }
    questions.push(newQuestion)
    return { ...newQuestion }
  },

  async update(id, questionData) {
    await delay(350)
    const index = questions.findIndex(q => q.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Question not found')
    }
    
    const updatedQuestion = {
      ...questions[index],
      ...questionData,
      Id: questions[index].Id // Preserve original Id
    }
    
    questions[index] = updatedQuestion
    return { ...updatedQuestion }
  },

  async delete(id) {
    await delay(300)
    const index = questions.findIndex(q => q.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Question not found')
    }
    
    const deletedQuestion = { ...questions[index] }
    questions.splice(index, 1)
    return deletedQuestion
  }
}

export default questionService