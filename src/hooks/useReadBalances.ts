import { useContractReads } from "wagmi";
import { erc20ABI } from "wagmi";

const auxo = { abi: erc20ABI, address: "0xff030228a046F640143Dab19be00009606C89B1d" };
const arv = { abi: erc20ABI, address: "0x069c0Ed12dB7199c1DdAF73b94de75AAe8061d33" };
const prv = { abi: erc20ABI, address: "0xc72fbD264b40D88E445bcf82663D63FF21e722AF" };
const veDough = { abi: erc20ABI, address: "0xe6136f2e90eeea7280ae5a0a8e6f48fb222af945" };

export function useVeDough() {
  return useContractReads({
    watch: true,
    contracts: [
      {
        ...veDough,
        functionName: "totalSupply",
      } as any,
    ],
  });
}

export function useReadBalances() {
  return useContractReads({
    watch: true,
    contracts: [
      {
        ...auxo,
        functionName: "totalSupply",
      } as any,
      {
        ...auxo,
        functionName: "balanceOf",
        args: ["0x3E70FF09C8f53294FFd389a7fcF7276CC3d92e64"],
      } as any,
      {
        ...arv,
        functionName: "totalSupply",
      } as any,
      {
        ...prv,
        functionName: "totalSupply",
      } as any,
      {
        ...prv,
        functionName: "balanceOf",
        args: ["0x096b4F2253a430F33edc9B8e6A8e1d2fb4faA317"],
      } as any,
    ],
  });
}
