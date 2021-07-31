import { Component, OnInit } from '@angular/core';
import { encrypt } from 'eth-sig-util'
import MetaMaskOnboarding from '@metamask/onboarding'

const forwarderOrigin = 'http://localhost:9010';


declare global {
  interface Window {
      ethereum: any;
  }
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  metamask_button = {
    text: "",
    disabled: true,
    onclick_function: ""
  };

  accounts_button = {
    text: "Connect to Metamask First",
    disabled: true,
  };

  accounts: any;
  balance: any;

  constructor() { }

  ngOnInit(): void {
    this.MetaMaskClientCheck()
  }

  isMetaMaskInstalled(): boolean{
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    console.log(ethereum);
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  MetaMaskClientCheck(): void {
    if (!this.isMetaMaskInstalled()) {
      this.metamask_button.text = 'install MetaMask!';
      this.metamask_button.onclick_function = 'onClickInstall';
      this.metamask_button.disabled = false;
    } else {
      this.metamask_button.text = 'Connect';
      this.metamask_button.onclick_function = 'onClickConnect';
      this.metamask_button.disabled = false;
    }
  }

  metamaskButtonClick(): void {
    if(this.metamask_button.onclick_function == 'onClickInstall'){
      this.onClickInstall();
    }
    else if(this.metamask_button.onclick_function == 'onClickConnect'){
      this.onClickConnect();
    }
  }

  async onClickConnect(): Promise<void> {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.accounts_button.text = 'List Accounts';
      this.accounts_button.disabled = false;
    } catch (error) {
      console.error(error);
    }
  }

  onClickInstall(): void {
    this.metamask_button.text = 'Onboarding in progress';
    this.metamask_button.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    new MetaMaskOnboarding({ forwarderOrigin }).startOnboarding();
  }

  async getAccounts(): Promise<void> {
    console.log(this.accounts);
    this.accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //We take the first address in the array of addresses and display it
  }

}
