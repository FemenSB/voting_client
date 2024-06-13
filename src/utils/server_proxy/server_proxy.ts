export interface IServerProxy {
  getStaticData(): Promise<VotingData>;
  sendVote(orderedCandidates: string[]): Promise<void>;
  getResults(): Promise<VotingResults>;
}

export type VotingData = {
  name: string;
  candidates: string[];
  endTime: Date;
};

export type VotingResults = {
  name: string;
  orderedCandidates: string[];
};
