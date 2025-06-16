const Title = ({ text1, text2, className = '' }) => {
  return (
    <div className=''>
      <p className={`text-black font-semibold ${className}`}>
        {text1}{' '}
        <span className='text-[#FF1461] font-semibold'>
          {text2}
        </span>
      </p>
    </div>
  )
}
export default Title
