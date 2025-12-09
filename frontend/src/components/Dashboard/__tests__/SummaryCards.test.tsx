import { render, screen } from '@testing-library/react'
import SummaryCards from '../SummaryCards'

describe('SummaryCards', () => {
  it('renders provided amounts', () => {
    render(
      <SummaryCards income={75000} allocated={32000} emi={12000} available={31000} />,
    )

    expect(screen.getByText(/Monthly Income/i)).toBeInTheDocument()
    expect(screen.getByText(/₹ 75,000/)).toBeInTheDocument()
    expect(screen.getByText(/₹ 32,000/)).toBeInTheDocument()
    expect(screen.getByText(/₹ 12,000/)).toBeInTheDocument()
    expect(screen.getByText(/₹ 31,000/)).toBeInTheDocument()
  })
})


