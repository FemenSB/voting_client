export interface IServerProxy {
  getStaticData(): Promise<VotingData>;
  sendVote(orderedCandidates: string[]): Promise<void>;
  getResults(): Promise<VotingResults>;
}

export type VotingData = {
  candidates: string[];
  endTime: Date;
};

export type VotingResults = {
  orderedCandidates: string[];
};
