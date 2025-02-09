import axios from 'axios';
import Agent from '../../src/utils/Agent'; // This is correct

class Agent {
  private socials: any; // Holds social media data
  private walletData: any; // Holds wallet data
  private apiUrl: string; // URL for the Agent Kit API

  constructor(socials: any, walletData: any, apiUrl: string) {
    this.socials = socials; // Initialize social data
    this.walletData = walletData; // Initialize wallet data
    this.apiUrl = apiUrl; // Set the API URL
  }

  // Method to collect data from social accounts and wallet
  public async collectData() {
    await this.collectSocialData(); // Collect social data
    await this.collectWalletData(); // Collect wallet data
  }

  // Private method to collect social data
  private async collectSocialData() {
    console.log('Collecting social data...');
    try {
      const response = await axios.post(`${this.apiUrl}/collectSocialData`, {
        socials: this.socials,
      });
      console.log('Social data collected:', response.data);
    } catch (error) {
      console.error('Error collecting social data:', error);
    }
  }

  // Private method to collect wallet data
  private async collectWalletData() {
    console.log('Collecting wallet data...');
    try {
      const response = await axios.post(`${this.apiUrl}/collectWalletData`, {
        walletData: this.walletData,
      });
      console.log('Wallet data collected:', response.data);
    } catch (error) {
      console.error('Error collecting wallet data:', error);
    }
  }

  // Method to build the portfolio based on collected data
  public async buildPortfolio() {
    console.log('Building portfolio...');
    try {
      const response = await axios.post(`${this.apiUrl}/buildPortfolio`, {
        socials: this.socials,
        walletData: this.walletData,
      });
      return response.data; // Return the portfolio data
    } catch (error) {
      console.error('Error building portfolio:', error);
      return null; // Return null if there's an error
    }
  }
}

export default Agent; // Export the Agent class