import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    return NextResponse.json({
      riskWeight: 0.3,
      tradingPattern: 'normal',
      riskMetrics: {
        frequency: 'low',
        slippage: 'normal',
        size: 'medium'
      }
    });
  } catch (error) {
    console.error('Trading behavior analysis error:', error);
    return NextResponse.json({ riskWeight: 0.5 });
  }
} 