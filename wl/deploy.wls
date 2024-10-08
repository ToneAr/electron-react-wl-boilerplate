#!/usr/bin/env wolframscript
SetDirectory[ DirectoryName[$InputFileName] ];
<<EchoTemporaryCLI.wxf

EchoTemporaryCLI[
	Quiet[
		If[FailureQ@PacletObject["LocalDeploy"],
			PacletInstall[CloudObject["user:tonya/PacletSites/Wolfram/LocalDeploy"]]
		],
		PacletInstall::samevers
	];
	<<LocalDeploy`;
	,
	"Initialising LocalDeploy`..."
];

EchoTemporaryCLI[
	expressions = Import[ "expressions.wl" ];
	,
	"Importing dispatcher.wl..."
];

EchoTemporaryCLI[
	LaunchKernels[ Min[{ Length[expressions], $ProcessorCount * 2 }] ];
	,
	"Launching parallel kernels..."
];

EchoTemporaryCLI[
	DistributeDefinitions[LocalDeploy];
	,
	"Distributing definitions..."
];

Print[ "\n","---------------- LocalDeploy: "<>ToString[PacletObject["LocalDeploy"]["Version"]]<>" ---------------", "\n"];

WaitAll[
	Function[{
			port,
			expr
		},
		ParallelSubmit[
			Print[
				StringJoin @
				KeyValueMap[{propName, prop}|->
					If[propName=="Endpoints",
						{
							"Endpoints:","\n",
							Sequence @@ KeyValueMap[{endpoint, iconizedExpr}|->
								{
									"\t",ToString[endpoint],": ",
									ToString[ Head@*First@iconizedExpr ],
									"\n"
								},
								prop
							]
						}
						,
						{
							propName,": ",ToString[prop],"\n"
						}
					]
					,
					LocalDeploy[
						expr,
						port
					]//First
				]
			]
		]
	] @@@ expressions
];

Pause[0.1];

Print[ "Type 'exit' to end process:" ];
While[
	ToString[Input[]] =!= "exit",
	Pause[0.1]
];
