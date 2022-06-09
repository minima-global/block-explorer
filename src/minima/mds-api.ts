import { MDS } from './mds';


export const txpow_block = (block: number) => {

  console.log('calling txpow_block w/ block number: ', block);
  return req(`txpow block:${block}`)
}

export const txpow_txpowid = (txpowid: string) => {
  return req(`txpow txpowid:${txpowid}`);
}

export const txpow_address = (addr: string) => {
  return req(`txpow address:${addr}`);
}

export const callStatus = () => {
  return req(`status`);
}


const req = (command: string) => {
    
  return new Promise((resolve) => {
      
      MDS.cmd(command, (resp: any) => {
          resolve(resp);
      });
  
  });
}