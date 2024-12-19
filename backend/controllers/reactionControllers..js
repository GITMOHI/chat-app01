const Day = require("../models/dayModel");


const addReaction = async (req,res) => {
    const {dayId,userId,reactionType} = req.body;

    try {
      const day = await Day.findById(dayId);
  
      if (!day) {
        throw new Error("Day not found");
      }
      
      //is there a reaction by that user...
      const existingReaction = day.reactions.find(
        (reaction) => reaction.user.toString() === userId.toString()
      );
  
      if (existingReaction) {
        // Update the existing reaction
        existingReaction.type = reactionType;
      } else {
        // Add a new reaction
        day.reactions.push({ user: userId, type: reactionType });
      }
  
      await day.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


const getReactionCounts = async (req,res) => {
    const{dayId}=req.body;

    try {
      const day = await Day.findById(dayId).select('reactions');
  
      if (!day) {
        throw new Error("Day not found");
      }
  
      // Aggregate reaction counts
      const reactionCounts = day.reactions.reduce((counts, reaction) => {
        counts[reaction.type] = (counts[reaction.type] || 0) + 1;
        return counts;
      }, {});
  
      res.send(reactionCounts);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // Usage example:
  // getReactionCounts(dayId).then(counts => console.log(counts));
    

  module.exports ={
    addReaction,
    getReactionCounts
  }
  // Usage example:
  // addReaction(dayId, userId, 'like');
  