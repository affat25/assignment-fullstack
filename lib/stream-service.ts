import { db } from "./db";
import { getSelf } from "./auth-service";

export const getStreamByUserId = async (userId: string) => {
    const stream = await db.stream.findUnique({
        where: {userId}
    })

    return stream
}

// get users who are following current user
export const getFollowingUsers = async () => {
    try{
        const self = await getSelf()

        const followingUsers = db.follow.findMany({
            where: {
                followingId: self.id
            },
            include: {
                follower: true
            },
        })

        return followingUsers
    } catch {

        return []
    }

}


export const startStream = async (id:string) => {

    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: {id},
    })

    if (!otherUser){
        throw new Error("User not found")
    }

    if (otherUser.id === self.id){
        throw new Error("Cannot follow yourself")
    }

    const existingFollow = await db.follow.findFirst({
        where:{
            followerId: self.id,
            followingId: otherUser.id,
        },
    })

    if(existingFollow){
        throw new Error("Already following")
    }

    const follow = await db.follow.create({
        data:{
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            following:true,
            follower:true,
        },
    })


    return follow


}

export const unfollowUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: {
            id,
        }
    })

    if(!otherUser){
        throw new Error("User not found")
    }

    if(otherUser.id === self.id){
        throw new Error("Cannot unfollow yourself")
    }

    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id
        }
    })

    if (!existingFollow){
        throw new Error("Not followung")
    }

    const follow = await db.follow.delete({
        where:{
            id:existingFollow.id
        },
        include:{
            following: true
        }
    })

    return follow
}