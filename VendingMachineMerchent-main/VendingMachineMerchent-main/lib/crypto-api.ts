"use client"

// Mock crypto API service - replace with real API calls
export interface CryptoToken {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap_rank: number
  image: string
}

export interface PriceData {
  timestamp: number
  price: number
}

class CryptoAPIService {
  private baseUrl = 'https://api.coingecko.com/api/v3'
  
  async getTopTokens(limit: number = 50): Promise<CryptoToken[]> {
    try {
      // In production, use real API
      // const response = await fetch(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`)
      // const data = await response.json()
      
      // Mock data for demo
      return [
        {
          id: 'algorand',
          symbol: 'ALGO',
          name: 'Algorand',
          current_price: 0.32 + (Math.random() - 0.5) * 0.02,
          price_change_percentage_24h: 2.4 + (Math.random() - 0.5) * 5,
          market_cap_rank: 35,
          image: '🪙'
        },
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          current_price: 43250 + (Math.random() - 0.5) * 1000,
          price_change_percentage_24h: -1.2 + (Math.random() - 0.5) * 5,
          market_cap_rank: 1,
          image: '₿'
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          current_price: 2650 + (Math.random() - 0.5) * 100,
          price_change_percentage_24h: 3.1 + (Math.random() - 0.5) * 5,
          market_cap_rank: 2,
          image: 'Ξ'
        },
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          current_price: 98.5 + (Math.random() - 0.5) * 10,
          price_change_percentage_24h: 5.2 + (Math.random() - 0.5) * 5,
          market_cap_rank: 5,
          image: '◎'
        },
        {
          id: 'avalanche-2',
          symbol: 'AVAX',
          name: 'Avalanche',
          current_price: 38.2 + (Math.random() - 0.5) * 5,
          price_change_percentage_24h: -0.8 + (Math.random() - 0.5) * 5,
          market_cap_rank: 12,
          image: '🔺'
        },
        {
          id: 'polkadot',
          symbol: 'DOT',
          name: 'Polkadot',
          current_price: 7.8 + (Math.random() - 0.5) * 1,
          price_change_percentage_24h: 1.9 + (Math.random() - 0.5) * 5,
          market_cap_rank: 15,
          image: '⚫'
        },
        {
          id: 'chainlink',
          symbol: 'LINK',
          name: 'Chainlink',
          current_price: 15.4 + (Math.random() - 0.5) * 2,
          price_change_percentage_24h: 2.7 + (Math.random() - 0.5) * 5,
          market_cap_rank: 18,
          image: '🔗'
        },
        {
          id: 'uniswap',
          symbol: 'UNI',
          name: 'Uniswap',
          current_price: 6.9 + (Math.random() - 0.5) * 1,
          price_change_percentage_24h: -2.1 + (Math.random() - 0.5) * 5,
          market_cap_rank: 22,
          image: '🦄'
        }
      ]
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      return []
    }
  }

  async getTokenPrice(tokenId: string): Promise<number> {
    try {
      // Mock real-time price updates
      const basePrice = this.getBasePriceForToken(tokenId)
      return basePrice + (Math.random() - 0.5) * basePrice * 0.02
    } catch (error) {
      console.error('Error fetching token price:', error)
      return 0
    }
  }

  async getHistoricalData(tokenId: string, days: number = 1): Promise<PriceData[]> {
    try {
      const data: PriceData[] = []
      const now = Date.now()
      const basePrice = this.getBasePriceForToken(tokenId)
      
      for (let i = 0; i < 100; i++) {
        const timestamp = now - (100 - i) * (days * 24 * 60 * 60 * 1000) / 100
        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1
        data.push({ timestamp, price })
      }
      
      return data
    } catch (error) {
      console.error('Error fetching historical data:', error)
      return []
    }
  }

  private getBasePriceForToken(tokenId: string): number {
    const basePrices: { [key: string]: number } = {
      'algorand': 0.32,
      'bitcoin': 43250,
      'ethereum': 2650,
      'solana': 98.5,
      'avalanche-2': 38.2,
      'polkadot': 7.8,
      'chainlink': 15.4,
      'uniswap': 6.9
    }
    return basePrices[tokenId] || 1
  }

  // Simulate portfolio performance calculation
  calculatePortfolioPerformance(tokens: any[], allocations: number[]): number {
    let totalPerformance = 0
    tokens.forEach((token, index) => {
      const allocation = allocations[index] || 0
      const performance = token.price_change_percentage_24h || 0
      totalPerformance += (allocation / 100) * performance
    })
    return totalPerformance
  }
}

export const cryptoAPI = new CryptoAPIService()
