import { isFollowingUser } from "@/lib/follow-service"
import { getUserByUsername } from "@/lib/user-service"
import { notFound } from "next/navigation"
import { Actions } from "./_components/actions"
import { currentUser } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"
import { Hint } from "@/components/hint"

interface UserPageProps {
    params:{
        username: string

    }
}

const UserPage = async ({
    params}: UserPageProps) => {

        const current_user = await currentUser()
        const user = await getUserByUsername(params.username)

        if (!user){
            notFound();
        }

    const isFollowing = await isFollowingUser(user.id)

  return (
    <div className="flex flex-col gap-y-4">
        <p>username: {user.username}</p>
        <p>user ID: {user.id}</p>
        <p>is following: {`${isFollowing}`}</p>
        {!current_user && (
           
                <SignInButton>
                    <Button variant="primary">
                    <Hint label="Sing-in to follow">
                        Follow
                    </Hint>
                    </Button>
                </SignInButton>
        )}
        {!!current_user &&(
            <Actions userId = {user.id} isFollowing = {isFollowing}/>
        )}
    </div>
  )
}

export default UserPage