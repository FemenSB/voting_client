export interface IServerProxy {
  getStaticData(): Promise<VotingData>;
}

export type VotingData = {
  candidates: string[];
  endTime: Date;
};
