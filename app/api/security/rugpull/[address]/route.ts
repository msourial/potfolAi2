import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    return NextResponse.json({
      riskWeight: 0.2,
      knownRugPulls: [],
      suspiciousProtocols: []
    });
  } catch (error) {
    console.error('Rugpull analysis error:', error);
    return NextResponse.json({ riskWeight: 0.5 });
  }
} 