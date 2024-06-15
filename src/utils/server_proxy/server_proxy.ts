export interface IServerProxy {
  getStaticData(): Promise<VotingData>;
  sendVote(orderedCandidates: string[]): Promise<void>;
  getResults(): Promise<VotingResults>;
  connectSocket(nickname: string,
      votersChangedCallback: (voters: VoterStatus[]) => void,
      votingEndedCallback: () => void): Promise<void>;
  setDone(done: boolean): Promise<void>;
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

export type VoterStatus = {
  nickname: string;
  done: boolean;
}
