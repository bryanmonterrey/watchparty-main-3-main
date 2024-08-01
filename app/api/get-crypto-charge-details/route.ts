// app/api/get-crypto-charge-details/route.ts

import { NextResponse } from 'next/server';
import { Client, resources } from 'coinbase-commerce-node';

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);
const { Charge } = resources;

type CryptoName = 'ethereum' | 'polygon' | 'base';

interface ExtendedCharge extends resources.Charge {
  web3_data?: {
    contract_addresses: Record<string, string>;
  };
  pricing: {
    local: { amount: string; currency: string };
    [key: string]: { amount: string; currency: string };
  };
}

const supportedCurrencies: Record<CryptoName, string[]> = {
  'ethereum': ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'UNI', 'LINK', 'AAVE', 'MKR', 'COMP', 'SNX', 'YFI', 'BAT', 'SUSHI', 'GRT'],
  'polygon': ['MATIC', 'WETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'AAVE', 'LINK', 'UNI', 'SUSHI', 'COMP', 'BAT', 'CRV'],
  'base': ['ETH', 'USDC', 'DAI', 'cbETH', 'WETH', 'USDbC', 'BALD', 'TRAC', 'MV', 'COMB'],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chargeId = searchParams.get('chargeId');

  if (!chargeId) {
    return new NextResponse("Charge ID is required", { status: 400 });
  }

  try {
    const charge = await Charge.retrieve(chargeId) as ExtendedCharge;
    
    console.log('Charge data:', JSON.stringify(charge, null, 2));

    const supportedChains: Record<CryptoName, string> = {
      'ethereum': '1',
      'polygon': '137',
      'base': '8453'
    };

    const paymentOptions = Object.entries(supportedChains).reduce((acc, [name, chainId]) => {
      const networkName = name as CryptoName;
      if (charge.web3_data?.contract_addresses[chainId]) {
        const networkCurrencies = supportedCurrencies[networkName];
        const networkOptions = networkCurrencies.reduce((currencyAcc, currency) => {
          const amount = charge.pricing[currency]?.amount || charge.pricing.local.amount;
          currencyAcc[currency] = {
            address: charge.web3_data!.contract_addresses[chainId],
            amount: charge.pricing.local.amount,
            currency: charge.pricing.local.currency,
            cryptoAmount: amount,
            cryptoCurrency: currency,
          };
          return currencyAcc;
        }, {} as Record<string, {
          address: string;
          amount: string;
          currency: string;
          cryptoAmount: string;
          cryptoCurrency: string;
        }>);
        
        acc[networkName] = networkOptions;
      }
      return acc;
    }, {} as Record<CryptoName, Record<string, {
      address: string;
      amount: string;
      currency: string;
      cryptoAmount: string;
      cryptoCurrency: string;
    }>>);

    if (Object.keys(paymentOptions).length === 0) {
      console.log('No payment options available:', JSON.stringify(charge, null, 2));
      return new NextResponse("No payment options available", { status: 404 });
    }

    return NextResponse.json({
      paymentOptions,
      expiresAt: charge.expires_at,
    });
  } catch (error) {
    console.error('Error retrieving charge details:', error);
    return new NextResponse("Failed to retrieve charge details", { status: 500 });
  }
}