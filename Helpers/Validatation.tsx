import * as yup from 'yup'
     const Rules = yup.object().shape({
      matric: yup.string().required().min(9).max(11),
      course: yup.string().required(),
      course_code: yup.string().required().min(6).max(8),
      lecturer: yup.string().required(),
      session_month: yup.string().required(),
      session_year: yup.string().required(),
      missed_mark: yup.number().typeError('You must specifiy number').min(1, 'must not be less than 1').max(100, 'Must not be greater than 100').required(),
      details: yup.string().required()
    })
export default Rules