const { Router } = require('express');
const userRouter = Router();
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const prisma = new PrismaClient();

const { formatDistanceToNow } = require('date-fns');



userRouter.get('/:userId', async (req, res) => {
    const userId = Number(req.params.userId);
    let result = await prisma.users.findUnique({
        where: {
            id: userId,
        }
    });

    res.json(result);
});


userRouter.post('/apply', async (req, res) => {
    let userId = Number(req.body.userId);
    let jobId = Number(req.body.jobId);

    try {
        let result = await prisma.jobsApps.create({
            data: {
                jobId: jobId,
                userId: userId,
            },
        });

        res.json(result);
    } catch (error) {
        console.error('Error applying for the job:', error);
        res.status(500).json({ error: 'Failed to apply for the job' });
    }
});




// ----------HR--------------------------------
userRouter.post('/addJob', async (req, res) => {
    let { jobName , jobDesc, userId, companyTitle, keywords } = req.body;


    let result = await prisma.jobs.create(
        {
            data: {
                name: jobName,
                description: jobDesc,
                postedBy: Number(userId),
                company: companyTitle,
                keywords,
            }
        }
    );

    res.json(result);
});


// GET myJobs of HR
userRouter.get('/myJobs/:userId', async (req, res) => {
    const userId = Number(req.params.userId);
    let result = await prisma.jobs.findMany({
        where: {
            postedBy: userId,
        },
        orderBy: {
            id: "desc",
        },
    });

    const formattedJobs = result.map(job => ({
        ...job,
        relativeTime: `${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`,
      }));


    res.json(formattedJobs);
});

module.exports = userRouter;