import { Input } from 'antd';
import { useState, useEffect } from 'react'
import CountUp from 'react-countup';
import './App.css'

function App() {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [result, setResult] = useState({ years: '--', months: '--', days: '--' })
  const [shouldCalculate, setShouldCalculate] = useState(false)
  const [errors, setErrors] = useState({ day: '', month: '', year: '' })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (shouldCalculate) {
      calculateAge();
      setShouldCalculate(false);
    }
  }, [shouldCalculate, day, month, year]);

  // validate date input
  const validateInputs = () => {
    let isValid = true;
    const newErrors = { day: '', month: '', year: '' };

    // validate year
    if (year.length !== 4 || isNaN(year) || parseInt(year) > new Date().getFullYear()) {
      newErrors.year = 'Invalid year';
      isValid = false;
    }

    // validate month
    if (!month || isNaN(month) || parseInt(month) < 1 || parseInt(month) > 12) {
      newErrors.month = 'Must be a valid month';
      isValid = false;
    }

    // validate day
    if (!day || isNaN(day) || parseInt(day) < 1) {
      newErrors.day = 'Must be a valid day';
      isValid = false;
    } else {
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      if (parseInt(day) > daysInMonth) {
        newErrors.day = `Must be a valid day`;
        isValid = false;
      }
    }
    setErrors(newErrors);
    setHasError(!isValid);
    return isValid;
  }

  const calculateAge = () => {
    if (!validateInputs()) {
      return;
    }

    const birthDate = new Date(`${year}-${month}-${day}`);
    const currentDate = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
      setErrors({ years: '--', months: '--', days: '--' });
      return;
    }

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
      days += lastMonth.getDate();
      months--;
    }

    setResult({ years, months, days });
  }

  const handleCalculate = () => {
    setShouldCalculate(true);
  }

  return (
    <div className='bg-white p-4 md:p-8 flex md:rounded-[1.5rem] md:rounded-br-[10rem] rounded-none flex-col max-w-[850px] md:m-12 m-0'>
      <div className='flex flex-col md:flex-row items-start md:items-end justify-center mb-8'>
        <DateInput
          label="DAY"
          value={day}
          onChange={setDay}
          placeholder="DD"
          error={errors.day}
        />
        <DateInput
          label="MONTH"
          value={month}
          onChange={setMonth}
          placeholder="MM"
          error={errors.month}
        />
        <DateInput
          label="YEAR"
          value={year}
          onChange={setYear}
          placeholder="YYYY"
          error={errors.year}
        />
      </div>
      <div className='rounded-b-3xl rounded-tr-3xl p-8 relative'>
        <div className='absolute inset-1 flex items-center -top-8 md:-top-4'>
          <div className='w-full border-t border-neutralLightGrey px-5'></div>
        </div>
        <button onClick={handleCalculate} className='absolute w-14 h-14 md:w-20 md:h-20 -top-4 right-[40%] md:right-0 bg-primaryPurple rounded-full p-4 hover:bg-neutralOffBlack'>
          <img src="/icon-arrow.svg" alt="#" />
        </button>
      </div>

      <div className='py-8'>
        <ResultLine label="years" value={result.years} hasError={hasError} />
        <ResultLine label="months" value={result.months} hasError={hasError} />
        <ResultLine label="days" value={result.days} hasError={hasError} />
      </div>
    </div>
  )
}

function DateInput({ label, value, onChange, placeholder, error }) {
  return (
    <div className='flex flex-col items-start mb-4 md:mb-0 w-full md:w-auto data-text'>
      <span className={` ${error ? 'text-primaryRed' : 'text-neutralSmokeyGrey'}`}>{label}</span>
      <div className='flex flex-col items-start justify-start'>
      <Input
        className={`date-input w-full md:w-24 ${error ? 'error' : ''}`}
        style={{ width: '60%', marginTop: 8, height: 60 }}
        size='large'
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && <span className='text-primaryRed text-xs mt-1'>{error}</span>}
      </div>
    </div>
  )
}

function ResultLine({label, value, hasError}) {
  return (
    <div className='flex items-start text-5xl md:text-9xl font-extrabold mb-2 result-text'>
      <span className='text-primaryPurple mr-2'>
      {value === '--' || hasError ? (
          '--'
        ) : (
          <CountUp end={parseInt(value)} duration={2} />
        )}
      </span>
      <span>{label}</span>
    </div>
  )
}

export default App
