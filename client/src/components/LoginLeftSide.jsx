const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 relative overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/office.jpg')", // ✅ add your image here
        }}
      />

      {/* DARK OVERLAY — darkens the image */}
      <div className="absolute inset-0 bg-black/60" />

      {/* GRADIENT OVERLAY — adds depth */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900/60 via-transparent to-black/40" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-white font-bold text-sm">EMS</span>
          </div>
          <span className="text-white/90 font-medium">Your Company</span>
        </div>

        {/* Main text */}
        <div className="flex flex-col gap-6">
          <div className="w-12 h-1 bg-indigo-400 rounded-full" />
          <h1 className="text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight">
            Employee <br />
            Management <br />
            System
          </h1>
          <p className="text-white/60 text-base max-w-sm leading-relaxed">
            Streamline your HR processes with our comprehensive employee
            management solution.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-4">
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/50 text-sm">Employees</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-white/50 text-sm">Departments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-white/50 text-sm">Uptime</div>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="border-l-2 border-indigo-400 pl-4">
          <p className="text-white/60 text-sm italic">
            "Managing people is the heart of every great organization."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftSide;
