import CandidateList from './candidate_list.component';

export default function VotingPage() {
  const candidates = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
  ];

  return (
    <CandidateList candidates={candidates}/>
  );
}
