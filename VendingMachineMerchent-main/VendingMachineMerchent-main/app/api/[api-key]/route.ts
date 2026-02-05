import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { 'api-key': string } }
) {
  try {
    const apiKey = params['api-key']
    
    const { data: machine, error } = await supabase
      .from('machines')
      .select('id, price, machine_contract_address')
      .eq('api_key', apiKey)
      .single()

    if (error || !machine) {
      console.error('Machine not found:', error)
      return NextResponse.json({ 
        success: false,
        price: null 
      })
    }

    return NextResponse.json({ 
      success: true,
      price: machine.price,
      deviceId: machine.id
    })
  } catch (error) {
    console.error('API key validation error:', error)
    return NextResponse.json({ 
      success: false,
      price: null 
    }, { status: 500 })
  }
}