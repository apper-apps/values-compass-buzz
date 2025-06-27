import assessmentData from '@/services/mockData/assessments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let assessments = [...assessmentData]

export const assessmentService = {
  async getAll() {
    await delay(300)
    return [...assessments]
  },

  async getById(id) {
    await delay(200)
    const assessment = assessments.find(a => a.Id === parseInt(id, 10))
    if (!assessment) {
      throw new Error('Assessment not found')
    }
    return { ...assessment }
  },

  async getRecent(limit = 5) {
    await delay(250)
    return [...assessments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(a => ({ ...a }))
  },

  async create(assessmentData) {
    await delay(400)
    const maxId = Math.max(...assessments.map(a => a.Id), 0)
    const newAssessment = {
      ...assessmentData,
      Id: maxId + 1,
      date: new Date().toISOString()
    }
    assessments.push(newAssessment)
    return { ...newAssessment }
  },

  async update(id, assessmentData) {
    await delay(350)
    const index = assessments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Assessment not found')
    }
    
    const updatedAssessment = {
      ...assessments[index],
      ...assessmentData,
      Id: assessments[index].Id // Preserve original Id
    }
    
    assessments[index] = updatedAssessment
    return { ...updatedAssessment }
  },

  async delete(id) {
    await delay(300)
    const index = assessments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Assessment not found')
    }
    
    const deletedAssessment = { ...assessments[index] }
    assessments.splice(index, 1)
    return deletedAssessment
  }
}

export default assessmentService