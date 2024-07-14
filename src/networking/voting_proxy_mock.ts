import { doNothing, sleep } from '../utils/do_nothing';
import {IVotingProxy, VoterStatus, VotingData, VotingResults} from './voting_proxy';

const VOTER_NOT_DONE = 'Johnathan';

export default class VotingProxyMock implements IVotingProxy {
  private userVoter_: VoterStatus = {nickname: '', done: false};
  private votingEndedCallback_: () => void = doNothing;
  private votersChangedCallback_: (voters: VoterStatus[]) => void = doNothing;
  private voters_: VoterStatus[] = [
    {nickname: 'Aston', done: true},
    {nickname: VOTER_NOT_DONE, done: false},
    {nickname: 'Judith', done: true},
  ];
  private voter_not_done_index_ = this.voters_.findIndex(
      voter => voter.nickname === VOTER_NOT_DONE);

  async getStaticData(): Promise<VotingData> {
    await sleep(1500);
    return {
      name: 'Class president',
      candidates: [
        'Brandt',
        'Adrianna',
        'Avis',
        'Jones',
        'Rochelle',
        'Carmella',
      ],
      endTime: new Date(new Date().getTime() + 5*60*1000)
    };
  }

  async sendVote(orderedCandidates: string[]): Promise<void> {
    return sleep(1000);
  }

  async getResults(): Promise<VotingResults> {
    await sleep(1500);
    return {
      name: 'Class president',
      orderedCandidates: [
        'Avis',
        'Brandt',
        'Adrianna',
        'Jones',
        'Rochelle',
        'Carmella',
      ]
    };
  }

  async connectSocket(nickname: string,
      votersChangedCallback: (voters: VoterStatus[]) => void,
      votingEndedCallback: () => void): Promise<void> {
    this.userVoter_.nickname = nickname;
    this.votersChangedCallback_ = votersChangedCallback;
    this.votingEndedCallback_ = votingEndedCallback;
    await sleep(1000);
    this.sendVoters_();
    await sleep(1.5*60*1000);
    this.voters_[this.voter_not_done_index_].done = true;
    this.sendVoters_();
  }

  private sendVoters_(): void {
    const allVoters = [...this.voters_,
        {nickname: this.userVoter_.nickname, done: this.userVoter_.done}];
    if (this.isEveryoneDone_()) {
      this.votingEndedCallback_();
      return;
    }
    this.votersChangedCallback_(allVoters);
  }

  private isEveryoneDone_(): boolean {
    return this.userVoter_.done && this.voters_.every(voter => voter.done);
  }

  async setDone(done: boolean): Promise<void> {
    this.userVoter_.done = done;
    this.sendVoters_();
  }
}
