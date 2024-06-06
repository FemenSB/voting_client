import { useParams } from 'react-router-dom';

import CandidateList from './candidate_list.component';

export default function VotingPage() {
  const { id } = useParams();
  console.log(id);

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
