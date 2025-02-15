import { Button, Card } from "@radix-ui/themes";

export const GatePage = () => {
  return (
    <>
      <div className="h-screen flex">
        <Card className=" m-auto">
          <div className="bg-[white] h-[250px] border-[2px] rounded-[10px]"></div>
          <h1 className="font-bold text-2xl text-center">
            Master Your Finances: Plan, Manage, Succeed
          </h1>
          <p className="text-center text-gray-600">
            Take control of your financial future with our comprehensive tools
            and resources.
          </p>
          <div className="flex flex-col gap-1 p-2">
            <Button variant="solid" className="mb-2">
              Login with Google
            </Button>
            <Button variant="outline">
              <a href="/terms-and-conditions">Terms and Conditions</a>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};
