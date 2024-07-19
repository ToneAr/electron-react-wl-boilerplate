#!/usr/bin/env wolframscript

Print[ "Initialising LocalDeploy`..." ];
Quiet[
    PacletInstall[CloudObject["PacletSites/Wolfram/LocalDeploy"]],
    PacletInstall::samevers
];
<<LocalDeploy`;

Print[ "Importing dispatcher.wl..." ];
SetDirectory[ DirectoryName[$InputFileName] ];
dispatcher = Import[ "dispatcher.wl" ];

Print[ "Parsing arguments..." ];
port = Quiet[
    ResourceFunction["CommandLineParse"][$CommandLine, {"--port", "-p"}] /. {
        { OrderlessPatternSequence[Failure[__], {a_}] } :> ToExpression[a],
        { Repeated[_Failure, {2}] } :> 4848 (* Default Port*)
    },
    {
        StringPart::partw,Part::partd,Part::take,
        StringMatchQ::strse,Part::partw,Part::pkspec1
    }
];
Print[ "Deploying dispatcher...","\n" ];
Print[ "---------------- LocalDeploy: "<>ToString[PacletObject["LocalDeploy"]["Version"]]<>" ---------------" ];
KeyValueMap[
    If[#1=="Endpoints",
        Print["Endpoints:"];
        KeyValueMap[Print["    ",ToString[#1]<>": "<>ToString[Head[First[#2]]]]&, #2],
        Print[#1<>": ", #2]
    ]&,
    LocalDeploy[
        dispatcher,
        port
    ]//First
];
Print[ "--------------------------------------------------","\n" ];

Pause[0.1];

Print[ "Type 'exit' to end process:" ];
While[
	ToString[Input[]] =!= "exit",
	Pause[0.1]
];
