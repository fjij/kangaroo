import { embedResponse } from '../responses/index.js';

export function help(_interaction) {
  return embedResponse({
    title: 'Introduction to Kangaroo 🦘',
    "color": 15422875,
    fields: [
      {
        name: "What is It? ⁉️",
        value: "Kangaroo is a crypto tipping bot built with Layer 2 onboarding in mind. It supports Ethereum and a range of ERC-20 tokens."
      },
      {
        name: "Frictionless withdrawals 💸",
        value: "Typical Ethereum token transactions can have fees upwards of $20. Harness the power of Layer 2 and withdraw your funds for nearly 100 times less."
      },
      {
        name: "Grow your community 👥",
        value: "Engage your discord server with a plethora community oriented features. Better yet, give crypto funds that your community members can actually use."
      },
      {
        name: "The Basics 📘",
        value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. "
      },
      {
        name: "Layer 2 Native 👏",
        value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. \n "
      }
    ]
  });
}
