import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    return NextResponse.json({
      riskWeight: 0.2,
      gasEfficiency: 'good',
      metrics: {
        averageGasUsed: '50000',
        gasOptimization: 'efficient',
        potentialSavings: '0'
      }
    });
  } catch (error) {
    console.error('Gas efficiency analysis error:', error);
    return NextResponse.json({ riskWeight: 0.5 });
  }
} 