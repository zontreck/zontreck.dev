import React from "react";
import gh from "./gh_zon.png";
import { CopyBlock, dracula } from "react-code-blocks";
import JSONApp from "./app.json";

function About() {
  const JSONA = JSON.stringify(() => JSONApp);
  var JSText = JSONApp;
  var RadarText = atob(JSText.radarData);
  var MainPageText = atob(JSText.htmlData);
  var HandlerText = atob(JSText.handlerData);
  JSText = atob(JSText.jsonData);
  return (
    <div style={{ marginLeft: "20px" }}>
      <h1>Hello! Thanks for visiting my website.</h1>
      My name is Tara Piccari, I like to think of myself as a software
      developer. Though the more technical term is a software engineer, I just
      prefer developer.
      <br />
      <div
        id="gh_"
        style={{
          position: "absolute",
          right: 100,
          top: 250,
        }}
      >
        <img
          src={gh}
          width={300}
          height={300}
          onclick={() => {
            window.location = "https://github.com/zontreck";
          }}
        ></img>
      </div>
      I go by the username on GitHub of{" "}
      <a href="https://github.com/zontreck">zontreck</a>. Most probably have not
      heard of me, and this is not actually surprising.
      <br />
      <br />I generally tend to keep to myself, although I love code no matter
      the language.
      <br />
      This website is actually written using ReactJS and Bootstrap, I picked it
      up in a single day just so I could finally make this website.
      <br />
      <br />
      This page will semi-serve as my resume, and portfolio.
      <br />
      <div id="hifi" style={{ width: "50%" }}>
        One of my more recent projects is code named BotCore5. This is a highly
        experimental bot application for Second Life compatible virtual worlds
        <br />
        <br />
        To use this app you simply need to run Bot. The name for this will
        depend on your platform. However to make it easier to tell when I refer
        to the executable, i'll tack a EXE extension onto it.
        <br />
        When I switched my bot over to using Linux, I discovered a major issue..
        It's not fast or easy to deploy on a GUI-less machine. So I wrote
        AutoUpdater. The program works by checking with the BotBuildChain
        repository to see what the master version is. If it finds that the repo
        has a much newer version, it will trigger the Upgrade process
        <br />
        This process works roughly like this: <br />
        {
          "AutoUpdater -> Checks remote version against Bot.dll ^ IF NOT NEWER START BOT THEN EXIT -> If newer is found copy the AutoUpdater executable to a temporary file -> Download update and extract -> Start the AutoUpdater from within the update tmp folder -> Replace original software -> Start the AutoUpdater again in the origin path and repeat step 1"
        }
        <br />
        This workflow for the automatic updater actually makes it significantly
        easier to rapidly deploy the bot software. Since the bot is spawned by
        the autoupdater if there is no update, all you really need to do is
        trigger a shell script to run wait.exe. If there isn't a bot running, it
        will immediately exit. If there is, it will stay running until the bot
        terminates.
        <br />
        This is really one of the projects I am more proud of since I had to
        invent 90% of the unique code myself, including a Reflection based
        command locator. As a part of Bot 5.3, there is now a new message API
        that is still in it's experimental stage, but now supports Discord, or
        potentially other platforms as well.
        <br />
        <br />
        From the time period of March 2018 to December 2019, I worked for a
        company called High Fidelity. While there I had various different roles,
        however my main role was as a virtual greeter to onboard new users. One
        of the more frequent roles I would be given near the end was to write up
        some javascript apps. One example I can give was a simple app to cause a
        beep to occur whenever someone left or entered the domain. This way we
        could work in other programs when the domain was empty, and then be
        notified when someone enters. Often times microphones of new users would
        be muted upon entry, and we would have to walk them through the Audio
        setup. The entry beep script is attached below.
        <br />
        <b>alerter.app.json</b>
        <br />
        <CopyBlock
          text={JSText}
          language={"json"}
          showLineNumbers={true}
          wrapLines={true}
          theme={dracula}
          codeBlock
        />
        <br />
        <b>radar.js</b>
        <div id="radarJS" style={{ height: "150px", overflowY: "scroll" }}>
          <CopyBlock
            text={RadarText}
            language={"javascript"}
            showLineNumbers={true}
            wrapLines={true}
            theme={dracula}
            codeBlock
          ></CopyBlock>
        </div>
        <br />
        As can be seen on line 63 of radar.js, we would run into a issue a lot
        where we had to cachebust just to get pages to behave properly because
        the interface client would cache literally everything.
        <br />
        <b>main.html</b>
        <CopyBlock
          text={MainPageText}
          language="javascript"
          showLineNumbers={true}
          wrapLines={true}
          theme={dracula}
          codeBlock
        ></CopyBlock>
        <br />
        <b>handler.js</b>
        <br />
        <div
          id="handler"
          style={{
            height: "150px",
            overflowY: "scroll",
          }}
        >
          <CopyBlock
            text={HandlerText}
            language={"javascript"}
            showLineNumbers={true}
            wrapLines={true}
            theme={dracula}
            codeBlock
          ></CopyBlock>
        </div>
        <br />
        <br />
        One small thing I had learned from that experience is: I really prefer
        regular javascript and HTML, not a hybrid implementation. A lot of the
        functions for Interface were very undocumented. I say were, because the
        project has gone in a completely opposite direction now as to what it
        was back then. I'm a little sad that they stopped making a unique
        virtual world for VR, but I understand that they had to do what was
        right for their company.
        <br />
        <br />
        If you wish to contact me with job offers or requesting commission of
        software, please, email me at{" "}
        <a href="mailto:tarapiccari@gmail.com">tarapiccari@gmail.com</a>
        <br />
        <br />
        If you'd like to take a peek at my most up to date resume, please feel
        free to click{" "}
        <a href="https://share.zontreck.dev/5AMA0iOEcn.pdf">here.</a>
      </div>
    </div>
  );
}

export default About;
