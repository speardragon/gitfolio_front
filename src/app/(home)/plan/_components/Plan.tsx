import PlanCard from "./PlanCard";

export default function Plan() {
  return (
    <>
      <div className="relative text-2xl font-bold grid grid-cols-[1fr_auto_1fr] px-6 py-4 md:pb-10 md:pt-[4.5rem]">
        <div></div>
        <div>플랜 업그레이드</div>
      </div>
      <div className="flex justify-center w-full space-x-6">
        <PlanCard
          title="Free"
          price="0"
          description="이력서 생성 기능을 사용해 보세요!"
          buttonLabel="나의 현재 플랜"
          buttonDisabled
          benefits={["이력서 생성 3회", "이력서 수정 1회"]}
          animationDelay="0.2s"
        />
        <PlanCard
          title="Pro"
          price="19,900"
          description="모든 기능을 무제한으로 사용하세요!"
          buttonLabel="Pro로 업그레이드"
          buttonDisabled={false}
          benefits={[
            "이력서 생성 무제한",
            "이력서 수정 무제한",
            "PDF 다운로드",
            "맞춤형 템플릿 사용",
          ]}
          animationDelay="0.2s"
        />
      </div>
    </>
  );
}
