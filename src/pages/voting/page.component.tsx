import CandidateList from './candidate_list.component';

export default function VotingPage() {
  const candidates = [
    'Brandt',
    'Adrianna',
    'Avis',
    'Jones',
    'Rochelle',
    'Carmella',
  ];

  return (
    <CandidateList candidates={candidates}/>
  );
}
