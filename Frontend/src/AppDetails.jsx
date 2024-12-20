import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "../src/App.css";
import { Link, useParams } from 'react-router-dom';

import { UserContext } from './UserContext';








const AppDetails = () => {

  let { appId } = useParams();
  console.log(appId);

  const [jobDetails, setJobDetails] = useState([]);


  const {user } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState({});
  const [allApps, setAllApps] = useState([]);

  //----------------------------------------------------------------
    const [matchingScores, setMatchingScores] = useState([]); // Liste des scores de matching
    const [error, setError] = useState(""); // Gestion des erreurs
    const [loading, setLoading] = useState(false); // État de chargement
  //----------------------------------------------------------------


  



  useEffect(() => {
    axios.get(`http://localhost:3000/jobs/${appId}`).then((response) => {
      setJobDetails(response.data);
      // setJobDetails(jobDetails.map(d => d.poster === Number(d.poster)));
      // setJobDetails.map(job => job.poster === Number(job.poster));
      console.log(response.data);
    }); // THIS JOB DETAILS


    // CANDIDATES
    axios.get('http://localhost:3000/jobs/candApps').then((response) => {
      setAllApps(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:3000/users/${user.id}`).then((response) => {
        setCurrentUser(response.data);
        console.log(response.data);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [user?.id]); 


  const applyJob = async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    try {
      await axios.post('http://localhost:3000/users/apply', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for the job.');
    }
  };


  let myApps = allApps.filter(app => Number(app.userId) === Number(user.id) );
  console.log(myApps);

  let thisJobApps = allApps.filter(app => Number(app.jobId) === Number(appId) );
  console.log(thisJobApps);

  let resumes = thisJobApps.map(app => app.candidate.resumeLink);
  console.log("resumes", resumes);

  console.log("jobDetails", jobDetails);






  //----------------------------------------------------------------
  const handleScoring = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setLoading(true); // Démarrer le chargement

    try {
      const response = await fetch("http://127.0.0.1:5000/matching-resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: jobDetails.description, resumes }),
      });

      const result = await response.json(); // Récupérer la réponse JSON
      console.log(result); // Afficher la réponse dans la console pour inspecter les données

      if (response.ok) {
        // Si la réponse est correcte, mettre à jour les scores de matching
        const transformedScores =
          result.scores?.map((score, index) => ({
            filename: result.filenames?.[index] || `Fichier ${index + 1}`, // Dynamique ou par défaut
            score: score || 0, // Ajouter une valeur par défaut pour le score
          })) || [];

        setMatchingScores(transformedScores);
        setError(""); // Réinitialiser les erreurs
      } else {
        setError(result.error || "Une erreur est survenue lors du traitement.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Erreur de connexion avec le serveur Flask."); // Erreur de connexion
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

 //----------------------------------------------------------------




    return (
        <body className="border-white border-2 flex flex-col px-40 font-inter ">
          <div className="bg-white text-black ">
                    {/* token */}
            <div className='text-xs h-9'>
            </div>
                    {/* token */}


{/* Welcome */}
<div className='flex justify-between items-end h-11 '>
</div>
{/* Welcome */}


            {/* ------------------------------------------------------ */}
            {/* MAIN */}
            <div className=''>
<div className='h-14 w-full flex items-center justify-end px-7 '>
  <div className='w-24 h-9 rounded-2xl border-2 border-black flex items-center justify-center gap-x-1'>
    <Link to={currentUser.isHr ? '/hr' : '/candidate'}>Back</Link> 
    <img src='left.png' className='rotate-180 w-4 h-5 '  />
    </div>
</div>

{/* job's details */}
<div className='flex flex-col gap-x-5 items-start justify-center min-h-80 border-2 border-black'>
<div className='h-full pl-16 py-6 w-full'>
<h2 className=''> {jobDetails.name} </h2>
<div className='h-2 w-full'></div>
<h6> {jobDetails.description} </h6>
<div className='h-2 w-full'></div>
<div className='flex gap-x-1'>
<h6 className='underline font-bold underline-offset-4'>Keywords:</h6>
<h6>{jobDetails.keywords !==null ? jobDetails.keywords : 'None'}  </h6>
</div>
<div className='h-2 w-full'></div>
<div className='flex gap-x-1'>
<h6 className='underline font-bold underline-offset-4'>Company:</h6>
  {/* <h6>{jobDetails.poster.fullName || ''} </h6>  */}
 <h6> {jobDetails.company || 'None'} </h6>
</div>
</div>

<div className='flex items-center justify-between w-full px-7 py-6' >
<form onSubmit={applyJob} className=''>
        <input type='hidden' name="userId" value={currentUser.id} />
        <input type='hidden' name="jobId" value={appId} />
  {currentUser.resumeLink && (
          <button type='submit' className={`text-2xl w-32 border-2 border-black h-10 ${myApps.some(myApp => Number(myApp.jobId) === Number(appId)) ? 'hidden' : ''}`}
          >Apply</button>
  )}
      </form>

<h6 className='text-end w-full'>Posted {jobDetails.relativeTime} </h6>
</div>

</div>
{/* job's details */}

<div className='h-5 w-full'></div>
{currentUser.isHr && (
  <h4 className='px-8'>Applications/ </h4>
)}
<div className='h-6 w-full  '></div>

{/* APPLICATIONS */}
{
currentUser.isHr && (
  thisJobApps.map((app, i) => (
    <div key={i}>
<div className='h-11 w-full border-2 border-black flex items-center justify-around gap-x-44 px-8'>
<h4 className=''>{i+1}. {app.candidate.username} </h4>
  <h5 className=''>Score: 8 /10</h5>
  <div className='flex gap-x-5 underline'>
    <button className='text-xl' onClick={() => {
      if(app.candidate.resumeLink) {
        window.open(app.candidate.resumeLink, '_blank')
      }
      else {
        alert("No resume");
      }
    } }>View resume</button>
    <p className='text-xl '>Accept</p>
    <p className='text-xl '>Remove</p>
  </div>
</div>

<div className='h-3 w-full'></div>
</div>
  ))
)
}

{/* APPLICATIONS */}







{/* Resume upload */}
{/* <div className='flex items-end'><h4>Upload resume/ </h4>   <h5>(.txt or .pdf)</h5>    </div>
<div className='h-6 w-full bg-yellow-400 '></div>
              <form onSubmit={handleSubmit} className='border-2 border-black flex items-center justify-center w-full h-48'>
<label
htmlFor='uploadResume'
className='cursor-pointer w-[280px] h-12 border-2 border-black flex items-center justify-center'
>
<h5>  {selectedFile? "Change" : "Upload"} resume</h5>
</label>
<div className='w-1 h-2'></div>
{selectedFile && <button type="submit" className='w-[280px] h-12 border-2 bg-blue-500 border-black text-white'><h5>Upload</h5></button> }
                  <input id="uploadResume" type="file" name="resumeLink" onChange={handleFileChange} className='hidden'/>
                  <input type='hidden' value={user.id} name="userId" />

      </form>

      <div className='h-6 w-full bg-yellow-400 '></div> */}

      {/* Resume upload */}






{/* dbdfbfdbdfbfdbdf */}
<div>
			<h1>Liste des Résumés avec Scores de Matching</h1>
			<form onSubmit={handleScoring}>
				<div>
				</div>
				<button type='submit' >View scores
				</button>
			</form>

			{matchingScores.length > 0 && (
				<div>
					<h2>Scores de Matching :</h2>
					<ul>
						{matchingScores
							.sort((a, b) => b.score - a.score) // Tri par ordre décroissant des scores
							.map((item, index) => (
								<li key={index}>
									<strong>{item.filename}</strong> : {item.score} / 10
								</li>
							))}
					</ul>
				</div>
			)}

			{error && (
				<div style={{ color: "red", marginTop: "1rem" }}>
					<p>{error}</p>
				</div>
			)}
		</div>
{/* dbdfbfdbdfbfdbdf */}


      {/* <h4>Latest jobs/ </h4>
      <Link>HR</Link> */}

            </div>
                        {/* MAIN */}
                        <div className='h-24 w-full '></div>

          </div>




      </body>
    );
};
    
export default AppDetails;