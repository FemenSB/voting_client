import './candidate_list.style.css'

type CandidateListProps = {
  candidates: string[];
};

export default function CandidateList({ candidates }: CandidateListProps) {
  return (
    <div id='candidate-list'>
      {candidates.map((name, i) =>
        <div id='candidate-container' key={i}>
          {name}
        </div>
      )}
    </div>
  );
}
